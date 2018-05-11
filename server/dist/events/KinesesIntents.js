module.exports = (ws) => {
    const AWS = require('aws-sdk');
    const kinesis = new AWS.Kinesis({
        region: 'us-east-1',
        params: { StreamName: 'Intents' }
    });
    // see below for options
    const readable = require('kinesis-readable')(kinesis, { iterator: 'LATEST', shardId: 'shardId-000000000001' });
    readable
        .on('data', (records) => {
        for (let x in records) {
            if (records[x].Data.toString()) {
                const record = records[x].Data.toString();
                const recordDATA = JSON.parse(record);
                const response = {
                    Intent: recordDATA.data
                };
                console.log(`Record ${x}: ` + JSON.stringify(response));
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify(response));
                }
            }
        }
        // console.log(JSON.parse(records.Data.data.toString()));
    })
        .on('checkpoint', function (sequenceNumber) {
        console.log(sequenceNumber);
    })
        .on('error', (err) => {
        console.error(err);
    })
        .on('end', function () {
        console.log('all done!');
    });
};
//# sourceMappingURL=KinesesIntents.js.map