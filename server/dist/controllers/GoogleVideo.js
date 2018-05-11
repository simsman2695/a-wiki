"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Imports the Google Cloud Video Intelligence library
const videoIntelligence = require('@google-cloud/video-intelligence');
const Storage = require('@google-cloud/storage');
// Creates a client
const client = new videoIntelligence.VideoIntelligenceServiceClient();
// The GCS uri of the video to analyze
const gcsUri = 'gs://somebucket-1234/mgagliardo.mp4';
// Construct request
const request = {
    inputUri: gcsUri,
    features: ['LABEL_DETECTION', 'SHOT_DETECTION'],
};
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
exports.requestStuff = (req, res, next) => {
    // Creates a client
    const storage = new Storage();
    const bucketName = 'somebucket-1234';
    // Lists files in the bucket
    /* storage
         .bucket(bucketName)
         .getFiles()
         .then((results: any) => {
             const files = results[0];

             console.log('Files:');
             files.forEach((file: any) => {
                 console.log(file.name);
                 storage
                     .bucket(bucketName)
                     .file(file.name)
                     .getMetadata()
                     .then((results2: any) => {
                         const metadata = results2[0];

                         console.log(`File: ${metadata.name}`);
                         console.log(`Bucket: ${metadata.bucket}`);
                         console.log(`Storage class: ${metadata.storageClass}`);
                         console.log(`Self link: ${metadata.selfLink}`);
                         console.log(`ID: ${metadata.id}`);
                         console.log(`Size: ${metadata.size}`);
                         console.log(`Updated: ${metadata.updated}`);
                         console.log(`Generation: ${metadata.generation}`);
                         console.log(`Metageneration: ${metadata.metageneration}`);
                         console.log(`Etag: ${metadata.etag}`);
                         console.log(`Owner: ${metadata.owner}`);
                         console.log(`Component count: ${metadata.component_count}`);
                         console.log(`Crc32c: ${metadata.crc32c}`);
                         console.log(`md5Hash: ${metadata.md5Hash}`);
                         console.log(`Cache-control: ${metadata.cacheControl}`);
                         console.log(`Content-type: ${metadata.contentType}`);
                         console.log(`Content-disposition: ${metadata.contentDisposition}`);
                         console.log(`Content-encoding: ${metadata.contentEncoding}`);
                         console.log(`Content-language: ${metadata.contentLanguage}`);
                         console.log(`Metadata: ${metadata.metadata}`);
                         console.log(`Media link: ${metadata.mediaLink}`);
                     })
                     .catch((err: Error) => {
                         console.error('ERROR:', err);
                     });
             });
         })
         .catch((err: Error) => {
             console.error('ERROR:', err);
         });
     // [END storage_list_files]
     */
    // Execute request
    client
        .annotateVideo(request)
        .then((results) => {
        const operation = results[0];
        console.log('Waiting for operation to complete... (this may take a few minutes)');
        return operation.promise();
    })
        .then((results) => {
        // Gets annotations for video
        const annotations = results[0].annotationResults[0];
        // Gets labels for video from its annotations
        const labels = annotations.segmentLabelAnnotations;
        labels.forEach((label) => {
            console.log(`Label ${label.entity.description} occurs at:`);
            label.segments.forEach((segment) => {
                segment = segment.segment;
                if (segment.startTimeOffset.seconds === undefined) {
                    segment.startTimeOffset.seconds = 0;
                }
                if (segment.startTimeOffset.nanos === undefined) {
                    segment.startTimeOffset.nanos = 0;
                }
                if (segment.endTimeOffset.seconds === undefined) {
                    segment.endTimeOffset.seconds = 0;
                }
                if (segment.endTimeOffset.nanos === undefined) {
                    segment.endTimeOffset.nanos = 0;
                }
                console.log(`\tStart: ${segment.startTimeOffset.seconds}` +
                    `.${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}s`);
                console.log(`\tEnd: ${segment.endTimeOffset.seconds}.` +
                    `${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}s`);
            });
            res.json(results);
            return next();
        });
    })
        .catch((err) => {
        res.json(err);
        console.error(err);
        return next();
    });
};
//# sourceMappingURL=GoogleVideo.js.map