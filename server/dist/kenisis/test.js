const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({
    region: 'us-east-1',
    params: { StreamName: 'my-stream' }
});
// see below for options
const readable = require('kinesis-readable')(kinesis, {});
readable
    .on('data', (records) => {
    console.log(records);
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
// Calling .close() will finish all pending GetRecord requests before emitting
// the 'end' event.
// Because the kinesis stream persists, the readable stream will not
// 'end' until you explicitly close it
setTimeout(() => {
    readable.close();
}, 60 * 60 * 1000);
//# sourceMappingURL=test.js.map