"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Authenticate = require("../controllers/Authenticate");
module.exports = (server) => {
    server.post('/auth', Authenticate.getAuth);
    server.post('/auth/refresh', Authenticate.refreshAuth);
    server.post('/google/auth', Authenticate.getGoogleAuth);
};
//# sourceMappingURL=AuthenticateRoutes.js.map