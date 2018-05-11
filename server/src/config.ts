import * as dotenv from 'dotenv';

const fs = require('fs-extra');

dotenv.config({ path: '.env' });

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8888;

/**
 * Replace certificates with production certificates
 */
export const settings: Config = {
    name: 'restify-server-ts',
    version: '0.0.1',
    port: port,
    env: 'dev',
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'something'
};

if (env === 'production') {
    settings.env = 'prod';
    // other production settings
}

export interface Config {
    name: string;
    version: string;
    port: number | string;
    env: string;
    key: any;
    cert: any;
    passphrase: any;
}
