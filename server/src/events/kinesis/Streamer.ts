import { logger } from './logger';
import { setInterval } from 'timers';

const util = require('util');
const fs = require('fs-extra');
const os = require('os');

export const streamer = (kinesis: any, config: any) => {
    console.log('Starting stream: ' + config.stream);
    const log = logger().getLogger();
    const store = './dist/libs/kinesis/stores/' + config.stream + '.json';
    const _createStreamIfNotCreated = (callback: Function) => {
        const params = {
            ShardCount: config.shards,
            StreamName: config.stream
        };

        kinesis.createStream(params, (err: any, data: any) => {
            if (err) {
                if (err.code !== 'ResourceInUseException') {
                    callback(err);
                    return;
                } else {
                    log.info(
                        util.format(
                            '%s stream is already created. Re-using it.',
                            config.stream)
                    );
                }
            } else {
                log.info(
                    util.format(
                        '%s stream doesn\'t exist. Created a new stream with that name ..',
                        config.stream)
                );
            }

            // Poll to make sure stream is in ACTIVE state before start pushing data.
            _waitForStreamToBecomeActive(callback);
        });
    };

    const _waitForStreamToBecomeActive = (callback: Function) => {
        kinesis.describeStream({ StreamName: config.stream }, (err: Error, data: any) => {
            if (!err) {
                log.info(
                    util.format(
                        'Current status of the stream is %s.',
                        data.StreamDescription.StreamStatus)
                );
                if (data.StreamDescription.StreamStatus === 'ACTIVE') {
                    callback(null);
                } else {
                    setTimeout(
                        () => {
                            _waitForStreamToBecomeActive(callback);
                        },
                        1000 * config.waitBetweenDescribeCallsInSeconds);
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

                    fs.unlink(store, (error: any) => {
                        if (error) {
                            console.log('failed to delete local image:' + error);
                        }
                    });

                })
                .catch((err: Error) => {
                    console.log(err);
                    log.error(err);
                });

        }
    };

    const _puToKenisis = (recordParams: any) => {
        const writeRecords = {
            Records: recordParams,
            StreamName: config.stream
        };

        kinesis.putRecords(writeRecords, (err: Error, data: any) => {
            if (err) {
                log.error(err);
                console.log(err);
            } else {
                log.info('Successfully sent data to Kinesis.');
            }
        });
    };

    _createStreamIfNotCreated((err: Error) => {
        if (err) {
            log.error(
                util.format(
                    'Error creating stream: %s',
                    err)
            );
            return;
        }
        setInterval(_writeToKinesis, 1000);

    });
};
