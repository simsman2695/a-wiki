import * as klawSync from 'klaw-sync';
import * as Promise from 'bluebird';

const AWS = require('aws-sdk');
const fs = require('fs-extra');
const path = require('path');

interface RekognitionOptions {
    collection: string;
    region: string;
    storagePath: string;
}

interface RekognitionError {
    code: number;
    message: string;
}

class FacialEval {
    public passes: number;
    public consistantPasses: number;
    public inconsistantPasses: number;
    public lastResult: any;
    public consistant: boolean;
    public confidence: any;

    constructor(conistant: boolean) {
        this.passes = 0;
        this.consistantPasses = 0;
        this.inconsistantPasses = 0;
        this.lastResult = null;
        this.consistant = conistant;
        this.confidence = 0;
    }
}

const facialConstants: any = {
    Beard: new FacialEval(true),
    Mustache: new FacialEval(true),
    Gender: new FacialEval(true)

};

let videoQuality = 0;
let videoPasses = 1;

const facialInconsistance: any = {
    EyesOpen: new FacialEval(false),
    Emotions: new FacialEval(false)
};

const facialWavering: any = {
    Pose: new FacialEval(false),
    MouthOpen: new FacialEval(false)
};

/**
 * Promised based helper class for AWS Rekognition
 */

export class Rekognition {

    public errors: Array<RekognitionError>;
    private options: RekognitionOptions;
    private rekognition: any;
    private s3: any;

    constructor(options: RekognitionOptions) {
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
    public authFace(user: string, image: string) {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                if (!this.faceIndexed(user)) {
                    this.createCollection(this.options.collection);
                    this.indexFace(user);
                }
                const bitmap = this.base64toBlob(image);
                this.rekognition.searchFacesByImage(
                    {
                        'CollectionId': this.options.collection,
                        'FaceMatchThreshold': 70,
                        'Image': {
                            'Bytes': bitmap,
                        },
                        'MaxFaces': 1
                    },
                    (err: Error, data: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }
                    });
            } catch (e) {
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
    public analyzeVideo(user: string, video: string) {
        const date = new Date();
        const seconds = date.getSeconds();
        return new Promise((resolve: Function, reject: Function) => {
            try {
                this.uploadVideo(user, video)
                    .then(() => {
                        this.startFaceDetection(user, seconds)
                            .then((faceJobId) => {
                                this.startLabelDetection(user, seconds)
                                    .then((labelJobId) => {
                                        resolve({ faceJobId, labelJobId });
                                    })
                                    .catch((err: Error) => {
                                        reject(err);
                                    });
                            })
                            .catch((err: Error) => {
                                reject(err);
                            });
                    })
                    .catch((err: Error) => {
                        reject(err);
                    });

            } catch (e) {
                reject(e);
            }
        });

    }

    /**
     * Get analysis from AWS and digest with local library
     *
     * @param jobIds
     * @returns {Bluebird<any>}
     */
    public getVideoAnalysis = (jobIds: any) => {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                const faceDetection = this.getFaceDetection(jobIds.faceJobId.JobId);
                faceDetection
                    .then((faces: any) => {
                        const human = this.isHuman(faces);
                        human.then((behaviors: any) => {
                            if (behaviors > 95) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }).catch((err: Error) => {
                            reject(err);
                        });

                    })
                    .catch((err: Error) => {
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Upload video to AWS
     *
     * @param {string} user
     * @param {string} video
     * @returns {Bluebird<any>}
     */
    private uploadVideo = (user: string, video: string) => {
        return new Promise((resolve: Function, reject: Function) => {
            const s3Params = {
                Bucket: 'video-rekognition',
                Key: user + '.mp4',
                Body: fs.readFileSync(video)
            };

            this.s3.upload(s3Params, (err: any, data1: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data1);
                }
            });
        });
    }

    /**
     * Start video analysis of faces in video
     *
     * @param {string} user
     * @param date
     * @returns {Bluebird<any>}
     */
    private startFaceDetection = (user: string, date: any) => {
        return new Promise((resolve: Function, reject: Function) => {
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
            this.rekognition.startFaceDetection(params, (err: Error, data2: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data2);
                }
            });
        });
    }

    /**
     * Start video analysis of objects in video
     *
     * @param {string} user
     * @param date
     * @returns {Bluebird<any>}
     */
    private startLabelDetection = (user: string, date: any) => {
        return new Promise((resolve: Function, reject: Function) => {
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
            this.rekognition.startLabelDetection(params, (err: Error, data2: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data2);
                }
            });
        });
    }

    /**
     * Get video analysis of faces in video
     *
     * @param {string} jobid
     * @returns {Bluebird<any>}
     */
    private getFaceDetection = (jobid: string) => {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                this.getFaceDetectionAnalysisStatus(jobid, resolve, reject);
            } catch (e) {
                reject(e);
            }

        });
    }

    /**
     * Iterates over job until status is complete
     *
     * @param {string} jobid
     * @param {Function} resolve
     * @param {Function} reject
     */

    private getFaceDetectionAnalysisStatus = (jobid: string, resolve: Function, reject: Function) => {
        const params = {
            JobId: jobid, /* required */
        };
        this.rekognition.getFaceDetection(params, (err: Error, data: any) => {
            if (err) {
                reject(err);
            } else {
                if (data.JobStatus === 'IN_PROGRESS') {
                    setTimeout(
                        () => {

                            this.getFaceDetectionAnalysisStatus(jobid, resolve, reject);
                        },
                        1000);
                } else if (data.JobStatus === 'SUCCEEDED') {
                    resolve(data.Faces);
                }
            }
        });
    }

    /**
     * Get video analysis of objects in video
     *
     * @param {string} jobid
     * @returns {Bluebird<any>}
     */
    private getLabelDetection = (jobid: string) => {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                this.getLabelDetectionAnalysisStatus(jobid, resolve, reject);
            } catch (e) {
                reject(e);
            }

        });
    }

    /**
     * Iterates over job until status is complete
     *
     * @param {string} jobid
     * @param {Function} resolve
     * @param {Function} reject
     */

    private getLabelDetectionAnalysisStatus = (jobid: string, resolve: Function, reject: Function) => {
        const params = {
            JobId: jobid, /* required */
        };
        this.rekognition.getLabelDetection(params, (err: Error, data: any) => {
            if (err) {
                reject(err);
            } else {
                if (data.JobStatus === 'IN_PROGRESS') {
                    setTimeout(
                        () => {

                            this.getLabelDetectionAnalysisStatus(jobid, resolve, reject);
                        },
                        1000);
                } else if (data.JobStatus === 'SUCCEEDED') {
                    resolve(data);
                }
            }
        });
    }

    /**
     * Analyze data from video and AWS to determine if video is a human or a hack
     *
     * @param Faces
     * @returns {Bluebird<any>}
     */

    private isHuman = (Faces: any) => {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                for (let i in Faces) {
                    if (Faces[i]) {
                        this.evalFace(Faces[i]);
                    }
                }
                const result = this.evalFaceResults();
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Evaluate data and seek behaviors to see if human or not
     *
     * @param face
     */
    private evalFace(face: any) {
        videoQuality = videoQuality + face.Face.Quality.Sharpness;
        videoPasses = videoPasses + 1;
        this.evalFacialConsistance(face, facialInconsistance);
        this.evalFacialConsistance(face, facialConstants);
        this.evalFacialConsistance(face, facialWavering);

    }

    private evalFaceResults() {
        videoQuality = videoQuality / videoPasses;
        const inc = this.analyzeFacialInconsistance(facialInconsistance);
        const constants = this.analyzeFaciaConstants(facialConstants);
        const rating = videoQuality + inc + constants;
        return rating / 3;
    }

    private analyzeFacialInconsistance(inconsistance: any) {
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

    private analyzeFaciaConstants(constant: any) {
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

    private evalFacialConsistance(face: any, evalObject: any) {

        for (let i in evalObject) {
            if (evalObject[i].lastResult === null) {
                evalObject[i].lastResult = face.Face[i].Value;

            } else {
                if (evalObject[i].lastResult !== face.Face[i].Value && face.Face[i].Confidence >= 90) {
                    evalObject[i].inconsistantPasses = evalObject[i].inconsistantPasses + 1;
                } else {
                    evalObject[i].consistantPasses = evalObject[i].consistantPasses + 1;
                }
                evalObject[i].lastResult = face.Face[i].Value;
                evalObject[i].passes = evalObject[i].passes + 1;
                if (evalObject[i].consistant) {
                    evalObject[i].confidence = evalObject[i].consistantPasses / evalObject[i].passes;
                } else {
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
    private createCollection(collection: string) {
        return this.rekognition.createCollection(
            { 'CollectionId': collection },
            (err: Error, data: any) => {
                if (err) {
                    // throw new Error(err.message);
                } else {
                    return true;
                }
            });
    }

    private faceIndexed(face: string) {
        let isIndexed = false;
        const paths = klawSync(this.options.storagePath + 'json', { nodir: true, ignore: ['*.json'] });
        paths.forEach((file: klawSync.Item) => {
            const match = '/' + face + '/';
            if (file.path.match(match)) {
                isIndexed = true;
            }
        });
        return isIndexed;
    }

    private indexFace(face: string) {
        const paths = klawSync(this.options.storagePath + 'images', { nodir: true, ignore: ['*.json'] });
        paths.forEach((file: klawSync.Item) => {

            if (file.path.match(face)) {
                const p = path.parse(file.path);
                const name = p.name.replace(/\W/g, '');
                const bitmap = fs.readFileSync(file.path);
                this.rekognition.indexFaces(
                    {
                        'CollectionId': this.options.collection,
                        'DetectionAttributes': ['ALL'],
                        'ExternalImageId': name,
                        'Image': {
                            'Bytes': bitmap
                        }
                    },
                    (err: Error, data: {}) => {
                        if (err) {
                            throw new Error(err.message);
                        } else {
                            const jsonPath = file.path.replace('images', 'json');
                            fs.writeJson(jsonPath + '.json', data, (error: Error) => {
                                if (error) {
                                    throw new Error(err.message);
                                }
                            });
                        }
                    });
            }
        });
    }

    private base64toBlob(b64Data: string) {
        const matches = b64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches === null || matches.length !== 3) {
            throw new Error('Invalid input string');
        }

        return new Buffer(matches[2], 'base64');
    }
}
