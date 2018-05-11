"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleVideo = require("../controllers/GoogleVideo");
module.exports = (server) => {
    server.get('/google/video', GoogleVideo.requestStuff);
};
//# sourceMappingURL=GoogleRoutes.js.map