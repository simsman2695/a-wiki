"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Athena_1 = require("../libs/AWS/Athena");
const errors = require("restify-errors");
/**
 * POST /auth
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */
exports.query = (req, res, next) => {
    if (!req.params.query) {
        return next(new errors.BadRequestError(`SQL must be present`));
    }
    const options = {
        collection: 'slackbotstore',
        database: 'slackbot',
        region: process.env.AWS_ATHENA_REGION
    };
    const athena = new Athena_1.Athena(options);
    athena.query(req.params.query)
        .then((result) => {
        res.json(result);
        return next();
    })
        .catch((err) => {
        res.json(err);
        return next();
    });
};
//# sourceMappingURL=Athena.js.map