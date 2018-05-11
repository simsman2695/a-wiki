"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klawSync = require("klaw-sync");
const Promise = require("bluebird");
const AWS = require('aws-sdk');
const fs = require('fs-extra');
const path = require('path');
class FacialEval {
    constructor(conistant) {
        this.passes = 0;
        this.consistantPasses = 0;
        this.inconsistantPasses = 0;
        this.lastResult = null;
        this.consistant = conistant;
        this.confidence = 0;
    }
}
const facialConstants = {
    Beard: new FacialEval(true),
    Mustache: new FacialEval(true),
    Gender: new FacialEval(true)
};
let videoQuality = 0;
let videoPasses = 1;
const facialInconsistance = {
    EyesOpen: new FacialEval(false),
    Emotions: new FacialEval(false)
};
const facialWavering = {
    Pose: new FacialEval(false),
    MouthOpen: new FacialEval(false)
};
/**
 * Promised based helper class for AWS Rekognition
 */
class Rekognition {
    constructor(options) {
        /**
         * Get analysis from AWS and digest with local library
         *
         * @param jobIds
         * @returns {Bluebird<any>}
         */
        this.getVideoAnalysis = (jobIds) => {
            return new Promise((resolve, reject) => {
                try {
                    const faceDetection = this.getFaceDetection(jobIds.faceJobId.JobId);
                    faceDetection
                        .then((faces) => {
                        const human = this.isHuman(faces);
                        human.then((behaviors) => {
                            if (behaviors > 95) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }).catch((err) => {
                            reject(err);
                        });
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        /**
         * Upload video to AWS
         *
         * @param {string} user
         * @param {string} video
         * @returns {Bluebird<any>}
         */
        this.uploadVideo = (user, video) => {
            return new Promise((resolve, reject) => {
                const s3Params = {
                    Bucket: 'video-rekognition',
                    Key: user + '.mp4',
                    Body: fs.readFileSync(video)
                };
                this.s3.upload(s3Params, (err, data1) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data1);
                    }
                });
            });
        };
        /**
         * Start video analysis of faces in video
         *
         * @param {string} user
         * @param date
         * @returns {Bluebird<any>}
         */
        this.startFaceDetection = (user, date) => {
            return new Promise((resolve, reject) => {
                const params = {
                    Video: {
                        S3Object: {
                            Bucket: 'video-rekognition',
                            Name: user + '.mp4'
                        }
                    },
                    ClientRequestToken: user + 'Facial' + date,
                    JobTag: user,
                    FaceAttributes: 'ALL',
                };
                this.rekognition.startFaceDetection(params, (err, data2) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data2);
                    }
                });
            });
        };
        /**
         * Start video analysis of objects in video
         *
         * @param {string} user
         * @param date
         * @returns {Bluebird<any>}
         */
        this.startLabelDetection = (user, date) => {
            return new Promise((resolve, reject) => {
                const params = {
                    Video: {
                        S3Object: {
                            Bucket: 'video-rekognition',
                            Name: user + '.mp4'
                        }
                    },
                    ClientRequestToken: user + 'Label' + date,
                    JobTag: user,
                    MinConfidence: 90.0
                };
                this.rekognition.startLabelDetection(params, (err, data2) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data2);
                    }
                });
            });
        };
        /**
         * Get video analysis of faces in video
         *
         * @param {string} jobid
         * @returns {Bluebird<any>}
         */
        this.getFaceDetection = (jobid) => {
            return new Promise((resolve, reject) => {
                try {
                    this.getFaceDetectionAnalysisStatus(jobid, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        /**
         * Iterates over job until status is complete
         *
         * @param {string} jobid
         * @param {Function} resolve
         * @param {Function} reject
         */
        this.getFaceDetectionAnalysisStatus = (jobid, resolve, reject) => {
            const params = {
                JobId: jobid,
            };
            this.rekognition.getFaceDetection(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (data.JobStatus === 'IN_PROGRESS') {
                        setTimeout(() => {
                            this.getFaceDetectionAnalysisStatus(jobid, resolve, reject);
                        }, 1000);
                    }
                    else if (data.JobStatus === 'SUCCEEDED') {
                        resolve(data.Faces);
                    }
                }
            });
        };
        /**
         * Get video analysis of objects in video
         *
         * @param {string} jobid
         * @returns {Bluebird<any>}
         */
        this.getLabelDetection = (jobid) => {
            return new Promise((resolve, reject) => {
                try {
                    this.getLabelDetectionAnalysisStatus(jobid, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        /**
         * Iterates over job until status is complete
         *
         * @param {string} jobid
         * @param {Function} resolve
         * @param {Function} reject
         */
        this.getLabelDetectionAnalysisStatus = (jobid, resolve, reject) => {
            const params = {
                JobId: jobid,
            };
            this.rekognition.getLabelDetection(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (data.JobStatus === 'IN_PROGRESS') {
                        setTimeout(() => {
                            this.getLabelDetectionAnalysisStatus(jobid, resolve, reject);
                        }, 1000);
                    }
                    else if (data.JobStatus === 'SUCCEEDED') {
                        resolve(data);
                    }
                }
            });
        };
        /**
         * Analyze data from video and AWS to determine if video is a human or a hack
         *
         * @param Faces
         * @returns {Bluebird<any>}
         */
        this.isHuman = (Faces) => {
            return new Promise((resolve, reject) => {
                try {
                    for (let i in Faces) {
                        if (Faces[i]) {
                            this.evalFace(Faces[i]);
                        }
                    }
                    const result = this.evalFaceResults();
                    resolve(result);
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        this.options = options;
        this.rekognition = new AWS.Rekognition({ region: this.options.region });
        this.s3 = new AWS.S3();
    }
    /**
     * Performs authentication per user and image provided
     *
     * @param {string} user
     * @param {string} image
     * @returns {Bluebird<any>}
     */
    authFace(user, image) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.faceIndexed(user)) {
                    this.createCollection(this.options.collection);
                    this.indexFace(user);
                }
                const bitmap = this.base64toBlob(image);
                this.rekognition.searchFacesByImage({
                    'CollectionId': this.options.collection,
                    'FaceMatchThreshold': 70,
                    'Image': {
                        'Bytes': bitmap,
                    },
                    'MaxFaces': 1
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    /**
     * Performs authentication per user and video provided
     *
     * @param {string} user
     * @param {string} video
     * @returns {Bluebird<any>}
     */
    analyzeVideo(user, video) {
        const date = new Date();
        const seconds = date.getSeconds();
        return new Promise((resolve, reject) => {
            try {
                this.uploadVideo(user, video)
                    .then(() => {
                    this.startFaceDetection(user, seconds)
                        .then((faceJobId) => {
                        this.startLabelDetection(user, seconds)
                            .then((labelJobId) => {
                            resolve({ faceJobId, labelJobId });
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    })
                        .catch((err) => {
                        reject(err);
                    });
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    /**
     * Evaluate data and seek behaviors to see if human or not
     *
     * @param face
     */
    evalFace(face) {
        videoQuality = videoQuality + face.Face.Quality.Sharpness;
        videoPasses = videoPasses + 1;
        this.evalFacialConsistance(face, facialInconsistance);
        this.evalFacialConsistance(face, facialConstants);
        this.evalFacialConsistance(face, facialWavering);
    }
    evalFaceResults() {
        videoQuality = videoQuality / videoPasses;
        const inc = this.analyzeFacialInconsistance(facialInconsistance);
        const constants = this.analyzeFaciaConstants(facialConstants);
        const rating = videoQuality + inc + constants;
        return rating / 3;
    }
    analyzeFacialInconsistance(inconsistance) {
        let rating = 0;
        let pass = 0;
        for (let i in inconsistance) {
            if (inconsistance[i]) {
                rating = 100 - inconsistance[i].confidence + rating;
                pass = pass + 1;
            }
        }
        return rating / pass;
    }
    analyzeFaciaConstants(constant) {
        let rating = 0;
        let pass = 0;
        for (let i in constant) {
            if (constant[i]) {
                rating = constant[i].confidence + rating;
                pass = pass + 1;
            }
        }
        return rating * 100 / pass;
    }
    evalFacialConsistance(face, evalObject) {
        for (let i in evalObject) {
            if (evalObject[i].lastResult === null) {
                evalObject[i].lastResult = face.Face[i].Value;
            }
            else {
                if (evalObject[i].lastResult !== face.Face[i].Value && face.Face[i].Confidence >= 90) {
                    evalObject[i].inconsistantPasses = evalObject[i].inconsistantPasses + 1;
                }
                else {
                    evalObject[i].consistantPasses = evalObject[i].consistantPasses + 1;
                }
                evalObject[i].lastResult = face.Face[i].Value;
                evalObject[i].passes = evalObject[i].passes + 1;
                if (evalObject[i].consistant) {
                    evalObject[i].confidence = evalObject[i].consistantPasses / evalObject[i].passes;
                }
                else {
                    evalObject[i].confidence = evalObject[i].inconsistantPasses / evalObject[i].passes;
                }
            }
        }
    }
    /**
     * Creates S3 collection
     *
     * @param {string} collection
     * @returns {any | Request<Rekognition.CreateCollectionResponse, AWSError>}
     */
    createCollection(collection) {
        return this.rekognition.createCollection({ 'CollectionId': collection }, (err, data) => {
            if (err) {
                // throw new Error(err.message);
            }
            else {
                return true;
            }
        });
    }
    faceIndexed(face) {
        let isIndexed = false;
        const paths = klawSync(this.options.storagePath + 'json', { nodir: true, ignore: ['*.json'] });
        paths.forEach((file) => {
            const match = '/' + face + '/';
            if (file.path.match(match)) {
                isIndexed = true;
            }
        });
        return isIndexed;
    }
    indexFace(face) {
        const paths = klawSync(this.options.storagePath + 'images', { nodir: true, ignore: ['*.json'] });
        paths.forEach((file) => {
            if (file.path.match(face)) {
                const p = path.parse(file.path);
                const name = p.name.replace(/\W/g, '');
                const bitmap = fs.readFileSync(file.path);
                this.rekognition.indexFaces({
                    'CollectionId': this.options.collection,
                    'DetectionAttributes': ['ALL'],
                    'ExternalImageId': name,
                    'Image': {
                        'Bytes': bitmap
                    }
                }, (err, data) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                    else {
                        const jsonPath = file.path.replace('images', 'json');
                        fs.writeJson(jsonPath + '.json', data, (error) => {
                            if (error) {
                                throw new Error(err.message);
                            }
                        });
                    }
                });
            }
        });
    }
    base64toBlob(b64Data) {
        const matches = b64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches === null || matches.length !== 3) {
            throw new Error('Invalid input string');
        }
        return new Buffer(matches[2], 'base64');
    }
}
exports.Rekognition = Rekognition;
//# sourceMappingURL=Rekognition.js.map