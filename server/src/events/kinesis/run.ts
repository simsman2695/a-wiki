import * as config from './config';

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis({ region: config.kinesis.region });

require('./streams/Listened')(kinesis);
require('./streams/Intents')(kinesis);
require('./streams/Retorts')(kinesis);
