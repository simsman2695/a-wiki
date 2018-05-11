"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require('fs-extra');
dotenv.config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8888;
/**
 * Replace certificates with production certificates
 */
exports.settings = {
    name: 'restify-server-ts',
    version: '0.0.1',
    port: port,
    env: 'dev',
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'something'
};
if (env === 'production') {
    exports.settings.env = 'prod';
    // other production settings
}
//# sourceMappingURL=config.js.map