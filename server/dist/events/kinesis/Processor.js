"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const timers_1 = require("timers");
const util = require('util');
const fs = require('fs-extra');
const os = require('os');
exports.streamer = (kinesis, config) => {
    console.log('Starting stream: ' + config.stream);
    const log = logger_1.logger().getLogger();
    const store = './dist/libs/kinesis/stores/' + config.stream + '.json';
    const _createStreamIfNotCreated = (callback) => {
        const params = {
            ShardCount: config.shards,
            StreamName: config.stream
        };
        kinesis.createStream(params, (err, data) => {
            if (err) {
                if (err.code !== 'ResourceInUseException') {
                    callback(err);
                    return;
                }
                else {
                    log.info(util.format('%s stream is already created. Re-using it.', config.stream));
                }
            }
            else {
                log.info(util.format('%s stream doesn\'t exist. Created a new stream with that name ..', config.stream));
            }
            // Poll to make sure stream is in ACTIVE state before start pushing data.
            _waitForStreamToBecomeActive(callback);
        });
    };
    const _waitForStreamToBecomeActive = (callback) => {
        kinesis.describeStream({ StreamName: config.stream }, (err, data) => {
            if (!err) {
                log.info(util.format('Current status of the stream is %s.', data.StreamDescription.StreamStatus));
                if (data.StreamDescription.StreamStatus === 'ACTIVE') {
                    callback(null);
                }
                else {
                    setTimeout(() => {
                        _waitForStreamToBecomeActive(callback);
                    }, 1000 * config.waitBetweenDescribeCallsInSeconds);
                }
            }
        });
    };
    const _writeToKinesis = () => {
        const consume = store + 'consume';
        if (fs.existsSync(store)) {
            fs.copy(store, consume)
                .then(() => {
                let writeRecords = [];
                const bitmap = fs.readFileSync(consume).toString('utf-8');
                const records = bitmap.split(os.EOL);
                for (let x in records) {
                    if (records[x].length > 1) {
                        const rec = JSON.parse(records[x]);
                        const recordParams = {
                            Data: records[x],
                            PartitionKey: rec.sensor
                        };
                        writeRecords.push(recordParams);
                    }
                }
                _puToKenisis(writeRecords);
                fs.unlink(store, (error) => {
                    if (error) {
                        console.log('failed to delete local image:' + error);
                    }
                });
            })
                .catch((err) => {
                console.log(err);
                log.error(err);
            });
        }
    };
    const _puToKenisis = (recordParams) => {
        const writeRecords = {
            Records: recordParams,
            StreamName: config.stream
        };
        kinesis.putRecords(writeRecords, (err, data) => {
            if (err) {
                log.error(err);
                console.log(err);
            }
            else {
                log.info('Successfully sent data to Kinesis.');
            }
        });
    };
    _createStreamIfNotCreated((err) => {
        if (err) {
            log.error(util.format('Error creating stream: %s', err));
            return;
        }
        timers_1.setInterval(_writeToKinesis, 1000);
    });
};
//# sourceMappingURL=Processor.js.map