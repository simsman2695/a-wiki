"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./kinesis/config");
const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({ region: config.kinesis.region });
module.exports = (ws, wss) => {
    require('./Subscriber')(ws, wss, ['Listened', 'Retorts', 'Intents']);
};
//# sourceMappingURL=Websockets.js.map