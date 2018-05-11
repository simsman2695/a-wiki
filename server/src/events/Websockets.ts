import * as config from './kinesis/config';

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis({region: config.kinesis.region});
module.exports = (ws: any, wss: any) => {
    require('./Subscriber')(ws, wss, ['Listened', 'Retorts', 'Intents']);
};
