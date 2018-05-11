"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * POST /auth
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */
exports.getWs = (req, res, next) => {
    res.json('Connected');
    return next();
};
//# sourceMappingURL=Websocket.js.map