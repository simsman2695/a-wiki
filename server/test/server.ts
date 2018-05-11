import * as dotenv from 'dotenv';
import restify = require('restify');
const jwt = require('restify-jwt-community');
const path = require('path');

export const settings: any = {
    name: 'restify-server-ts',
    version: '0.0.1',
    port: 8888,
    env: 'dev'
};

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

dotenv.config({ path: '.env' });
export const testToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzNzY3NDc4MzcsImRhdGEiOnsiZW1haWwiOiJ' +
    'tZ2FnbGlhcmRvQHR3aWxpby5jb20ifSwiaWF0IjoxNTEyNzQ3ODM3fQ.jIWxrMWs7ASThhzNppGb2z-05LSn4ldC_fxcVRKIcoQ';
export const server = restify.createServer(settings);

server.use(restify.plugins.queryParser());

/**
 * Server plugins
 */

server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
server.use(restify.plugins.acceptParser(server.acceptable));

server.use((req: restify.Request, res: restify.Response, next: restify.Next) => {
    req.accepts('application/json');
    return next();
});

/**
 * Set access headers
 */

server.use((req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization'
    );
    next();
});

/**
 * CORS Preflight options
 *
 */

server.opts(/\.*/, (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200);
    next();
});

/**
 * Error Logging. Use to capture metrics
 */

server.on('restifyError', (req: restify.Request, res: restify.Response, err: Error, callback: Function) => {
    return callback();
});

/**
 * JWT Middleware for all endpoints
 *
 * Extract signed key from auth header (Authorization: Bearer {jwt})
 *
 */

server.use(jwt({ secret: process.env.SESSION_SECRET }).unless({
    path: ['/auth', '/facial/auth', '/facial/video', '/facial/video/test'] }));

/**
 * Routes
 */

require('../src/routes')(server);
