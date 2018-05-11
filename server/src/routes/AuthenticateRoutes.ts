import * as Authenticate from '../controllers/Authenticate';

module.exports = (server: any) => {
    server.post('/auth', Authenticate.getAuth);
    server.post('/auth/refresh', Authenticate.refreshAuth);
};
