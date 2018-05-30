"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const config_1 = require("./config");
const restify = require("restify");
const WebSocket = require('ws');
const jwt = require('restify-jwt-community');
const path = require('path');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });
const server = restify.createServer(config_1.settings);
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
server.use(restify.plugins.throttle({ burst: 10, rate: 5, ip: true }));
server.use((req, res, next) => {
    req.accepts('application/json');
    return next();
});
/**
 * CORS Preflight options
 *
 */
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS, UPGRADE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization');
    next();
});
server.opts(/\.*/, (req, res, next) => {
    res.send(200);
    next();
});
/**
 * Error Logging. Use to capture metrics
 */
server.on('restifyError', (req, res, err, callback) => {
    console.log(err);
    return callback();
});
/**
 * JWT Middleware for all endpoints
 *
 * Extract signed key from auth header (Authorization: Bearer {jwt})
 *
 */
server.use(jwt({ secret: process.env.SESSION_SECRET }).unless({
    path: ['/auth', '/google/auth']
}));
/**
 * Routes
 */
require('./routes')(server);
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        console.log(msg);
        ws.send('Message recieved!: ' + msg);
    });
    ws.on('open', () => {
        ws.send('something');
    });
    ws.on('error', (err) => console.log(err.message));
    require('./events/Websockets')(ws, wss);
});
wss.on('error', (err) => console.log(err.message));
server.listen(config_1.settings.port, () => {
    console.log('Listening on %d', server.address().port);
    const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
        rejectUnauthorized: false
    });
    ws.on('open', function open() {
        ws.send('All glory to WebSockets!');
    });
});
//# sourceMappingURL=server.js.map