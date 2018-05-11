import { Next, Request, Response } from 'restify';
import  errors = require('restify-errors');

const jwt = require('jsonwebtoken');
const secret = process.env.SESSION_SECRET;

interface RequestExtended extends Request {
    user: any;
}

/**
 * POST /auth
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */

export const getAuth = (req: Request, res: Response, next: Next) => {
    if (!req.params.username || !req.params.password) {
        return next(new errors.BadRequestError(`All parameters are required (username|password)`));
    }

    const credentials = { username: req.params.username, password: req.params.password };
    const accessToken = getJwtToken({ user: req.params.username });
    res.json({ accessToken: accessToken });
    return next();

};

/**
 * POST /auth/refresh
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */

export const refreshAuth = (req: RequestExtended, res: Response, next: Next) => {
    const accessToken = getJwtToken({ username: req.user.username });
    res.json({ accessToken: accessToken });
    return next();
};

const getJwtToken = (data: object) => {
    return jwt.sign(
        {
            data: data
        },
        secret
    );
};
