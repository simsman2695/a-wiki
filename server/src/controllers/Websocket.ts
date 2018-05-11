import { Next, Request, Response } from 'restify';

/**
 * POST /auth
 * Authenticate against OWL's and return user
 * this is expected to use from app so the token does not expire
 * object with JWT
 */

export const getWs = (req: Request, res: Response, next: Next) => {
    res.json('Connected');
    return next();
};
