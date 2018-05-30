"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = require("restify-errors");
const jwt = require('jsonwebtoken');
const secret = process.env.SESSION_SECRET;
/**
 * POST /auth
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */
exports.getAuth = (req, res, next) => {
    if (!req.params.username || !req.params.password) {
        return next(new errors.BadRequestError(`All parameters are required`));
    }
    const credentials = { username: req.params.username, password: req.params.password };
    const accessToken = getJwtToken({ user: req.params.username });
    res.json({ accessToken: accessToken });
    return next();
};
/**
 * POST /google/auth
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */
exports.getGoogleAuth = (req, res, next) => {
    if (!req.params.accessToken) {
        return next(new errors.BadRequestError(`All parameters are required`));
    }
    console.log(req.params.accessToken);
    const userData = jwt.decode(req.params.accessToken, {
        issuer: 'https://securetoken.google.com',
        audience: 'a-wiki-1526055039358'
    });
    console.log(userData);
    // const credentials = { username: req.params.username, password: req.params.password };
    // const accessToken = getJwtToken({ user: req.params.username });
    res.json({ accessToken: userData });
    return next();
};
/**
 * POST /auth/refresh
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */
exports.refreshAuth = (req, res, next) => {
    const accessToken = getJwtToken({ username: req.user.username });
    res.json({ accessToken: accessToken });
    return next();
};
const getJwtToken = (data) => {
    return jwt.sign({
        data: data
    }, secret);
};
//# sourceMappingURL=Authenticate.js.map