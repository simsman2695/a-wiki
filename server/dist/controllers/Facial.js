"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = require("../libs/Cache/Redis");
const Rekognition_1 = require("../libs/AWS/Rekognition");
const errors = require("restify-errors");
const ffmpeg = require('ffmpeg');
const rimraf = require('rimraf');
const fs = require('fs');
const dir = './dist/public/tmp/';
const redis = new Redis_1.Redis();
/**
 * Instantiate Rekognition lib
 */
const rekognition = new Rekognition_1.Rekognition({
    collection: process.env.AWS_REKOGNITION_COLLECTION,
    region: process.env.AWS_REKOGNITION_REGION,
    storagePath: './src/public/faces/'
});
/**
 * POST /facial/auth
 * Authenticate image submitted against directory of images
 * Unprotected Route
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 */
exports.authenticate = (req, res, next) => {
    if (!req.params.username || !req.params.image) {
        return next(new errors.BadRequestError(`All parameters are required (username|image)`));
    }
    // TODO: Import images from workday here, or use a separate service to store all images before request
    const query = redis.get(req.params.username);
    query.then((result) => {
        if (typeof result === 'string') {
            performImageAuth(req.params.username, req.params.image, res, next);
        }
        else {
            return next(new errors.BadRequestError(`No anticipated authentication requests`));
        }
    }).catch((err) => {
        res.json(err);
        return next();
    });
};
/**
 * POST /facial/video
 * Authenticate video submitted against directory of images
 * Unprotected Route
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 */
exports.authenticateVideo = (req, res, next) => {
    if (!req.params.username || !req.params.video) {
        return next(new errors.BadRequestError(`All parameters are required (username|video)`));
    }
    const path = dir + req.params.username + '/';
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        fs.writeFileSync(path + req.params.username + '.webm', base64toBlob(req.params.video));
    }
    else {
        rimraf(path, function () {
            fs.mkdirSync(path);
            fs.writeFileSync(path + req.params.username + '.webm', base64toBlob(req.params.video));
        });
    }
    try {
        setTimeout(() => {
            parseVideo(req, res, next);
        }, 500);
    }
    catch (e) {
        return next(new errors.BadRequestError(e.message));
    }
};
/**
 * We slice an image from the orginal video to use for the facial look up later
 * We also degrade the video, this helps to determine if the video is a human or someone trying to hack it
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
const parseVideo = (req, res, next) => {
    const path = dir + req.params.username + '/';
    const process = new ffmpeg(path + req.params.username + '.webm');
    // Slice image to be used later
    sliceImage(process, path, req, next);
    process.then((video) => {
        let reduciton = '100%';
        if (video.metadata.video.resolution.w >= 1280) {
            reduciton = '30%';
        }
        // Convert video to a format usable by AWS
        video.setVideoFormat('mp4')
            .setVideoCodec('h264')
            .setVideoAspectRatio('16:9')
            .setVideoSize(reduciton, true, true)
            .setVideoFrameRate(60)
            .save(path + req.params.username + '.mp4', (error, file) => {
            if (!error) {
                // Begin video analysis
                analyzeVideo(req, res, next);
            }
            else {
                return next(new errors.BadRequestError(error.message));
            }
        });
    }).catch((err) => {
        return next(new errors.BadRequestError(err.message));
    });
};
/**
 * Slice an image to be used later to authenticate against
 *
 * @param {Promise} process
 * @param {string} path
 * @param {Request} req
 * @param {Next} next
 */
const sliceImage = (process, path, req, next) => {
    process.then((video) => {
        if (video.metadata.video.resolution.w === 0) {
            return next(new errors.BadRequestError(`Malformed video`));
        }
        else {
            video.fnExtractFrameToJPG(path, {
                number: 1,
                start_time: 2,
                size: '1280x720',
                file_name: req.params.username + '.jpg',
                keep_aspect_ratio: false,
                keep_pixel_aspect_ratio: false
            });
        }
    }).catch((err) => {
        return next(new errors.BadRequestError(err.message));
    });
};
/**
 * Use AWS to analyze video contents
 * Returns error in the event we detect someone is trying to hack the auth with an image
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
const analyzeVideo = (req, res, next) => {
    const path = dir + req.params.username + '/';
    rekognition.analyzeVideo(req.params.username, path + req.params.username + '.mp4')
        .then((job) => {
        rekognition.getVideoAnalysis(job).then((result) => {
            if (result) {
                performImageAuth(req.params.username, 'data:jpeg;base64,' +
                    fileAsBase64(path + req.params.username + '_1.jpg'), res, next);
                rimraf(path, function () {
                    console.log(`tmp path removed`);
                });
            }
            else {
                return next(new errors.BadRequestError('Something isn\'t right...'));
            }
        }).catch((err) => {
            return next(new errors.BadRequestError(err.message));
        });
    }).catch((err) => {
        return next(new errors.BadRequestError(err.message));
    });
};
/**
 * Use AWS to perform facial comparison with directory of users
 *
 * @param {string} user
 * @param {string} image
 * @param {Response} res
 * @param {Next} next
 */
const performImageAuth = (user, image, res, next) => {
    rekognition.authFace(user, image).then((authResult) => {
        setAuthResult(user, authResult.toString(), res, next);
    }).catch((err) => {
        return next(new errors.BadRequestError(err.message));
    });
};
/**
 * Sets key in caching service after Authentication
 * @param {string} username
 * @param {string} status
 * @param {Response} res
 * @param {Next} next
 *
 * returns object {username, authenticated}
 */
const setAuthResult = (username, status, res, next) => {
    const updateQuery = redis.set(username, status, 60);
    updateQuery.then((update) => {
        res.json({ username: username, authenticated: status });
        return next();
    }).catch((err) => {
        res.json(err);
        return next();
    });
};
/**
 * DELETE /facial/authkey/:username
 * Deletes key in caching service
 * Protected Route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 * returns string
 */
exports.deleteUserKeyAuth = (req, res, next) => {
    if (!req.params.username) {
        return next(new errors.BadRequestError(`All parameters are required (username)`));
    }
    const updateQuery = redis.del(req.params.username);
    updateQuery.then((update) => {
        res.json(`${req.params.username} has been deleted`);
        return next();
    }).catch((err) => {
        res.json(err);
        return next();
    });
};
/**
 * GET /facial/authkey/:username
 * Gets key in caching service
 * Protected Route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 *  returns object {username, authenticated}
 */
exports.getUserKeyAuth = (req, res, next) => {
    if (!req.params.username) {
        return next(new errors.BadRequestError(`All parameters are required (username)`));
    }
    const query = redis.get(req.params.username);
    query.then((result) => {
        if (result === null) {
            return next(new errors.BadRequestError(`No result for key: ${req.params.username}`));
        }
        else {
            res.json({ username: req.params.username, authenticated: result });
            return next();
        }
    }).catch((err) => {
        res.json(err);
        return next();
    });
};
/**
 * POST /facial/authkey/:username
 * Gets key in caching service
 * Protected Route
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 *  returns object {username, authenticated}
 */
exports.createUserKeyAuth = (req, res, next) => {
    if (!req.params.username) {
        return next(new errors.BadRequestError(`All parameters are required (username)`));
    }
    const username = req.params.username;
    const updateQuery = redis.set(username, 'null', 60);
    updateQuery.then((update) => {
        res.json({ username: username });
        return next();
    }).catch((err) => {
        res.json(err);
        return next();
    });
};
/**
 * Helper function to convert base64 string to blob
 *
 * @param {string} b64Data
 * @returns {Buffer}
 */
// TODO: figure out what is breaking here when auth from UI
const base64toBlob = (b64Data) => {
    const matches = b64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches === null || matches.length !== 3) {
        throw new Error('Invalid input string');
    }
    return new Buffer(matches[2], 'base64');
};
/**
 * Helper funciton imports a file as base64
 *
 * @param {string} file
 * @returns {string}
 */
const fileAsBase64 = (file) => {
    const bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
};
//# sourceMappingURL=Facial.js.map