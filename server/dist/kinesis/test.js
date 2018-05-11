const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({
    region: 'us-east-1',
    params: { StreamName: 'Listened' }
});
// see below for options
const readable = require('kinesis-readable')(kinesis, { iterator: 'LATEST' });
readable
    // 'data' events will trigger for a set of records in the stream
    .on('data', (records) => {
    console.log(typeof records);
    console.log(records.length);
    for (let x in records) {
        if (records[x].Data.toString()) {
            console.log(`Record ${x}: ` + records[x].Data);
        }
    }
    // console.log(JSON.parse(records.Data.data.toString()));
})
    // each time a records are passed downstream, the 'checkpoint' event will provide
    // the last sequence number that has been read
    .on('checkpoint', function (sequenceNumber) {
    console.log(sequenceNumber);
})
    .on('error', (err) => {
    console.error(err);
})
    .on('end', function () {
    console.log('all done!');
});
//# sourceMappingURL=test.js.map