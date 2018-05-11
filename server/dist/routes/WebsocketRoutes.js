"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Websocket = require("../controllers/Websocket");
module.exports = (server) => {
    server.get('/websocket', Websocket.getWs);
};
//# sourceMappingURL=WebsocketRoutes.js.map