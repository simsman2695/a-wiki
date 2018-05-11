"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facial = require("../controllers/Facial");
module.exports = (server) => {
    server.post('/facial/auth', Facial.authenticate);
    server.post('/facial/video', Facial.authenticateVideo);
    server.del('/facial/authkey/:username', Facial.deleteUserKeyAuth);
    server.post('/facial/authkey/:username', Facial.createUserKeyAuth);
    server.get('/facial/authkey/:username', Facial.getUserKeyAuth);
};
//# sourceMappingURL=FacialRoutes.js.map