module.exports = (ws) => {
    const AWS = require('aws-sdk');
    const kinesis = new AWS.Kinesis({
        region: 'us-east-1',
        params: { StreamName: 'Listened', ShardId: 'shardId-000000000001' }
    });
    const shardParams = {
        ShardId: 'shardId-000000000001',
        ShardIteratorType: 'LATEST',
        StreamName: 'Listened',
        Timestamp: new Date
    };
    setInterval(() => {
        kinesis.getShardIterator(shardParams, (err, data) => {
            if (err) {
                console.log(err, err.stack); // an error occurred
            }
            else {
                const params = {
                    ShardIterator: data.ShardIterator
                };
                kinesis.getRecords(params, (err2, raw) => {
                    if (err2) {
                        console.log(err2, err2.stack); // an error occurred
                    }
                    else {
                        const records = raw.Records;
                        console.log(records);
                        for (let x in records) {
                            if (records[x].Data) {
                                const record = records[x].Data.toString();
                                const recordDATA = JSON.parse(record);
                                const response = {
                                    Listen: recordDATA.data
                                };
                                console.log(`Record ${x}: ` + JSON.stringify(response));
                                console.log(ws.readyState);
                                if (ws.readyState === 1) {
                                    ws.send(JSON.stringify(response));
                                }
                            }
                        }
                    } // successful response
                });
            }
        });
    }, 50);
};
//# sourceMappingURL=KinesesRetorts.js.map