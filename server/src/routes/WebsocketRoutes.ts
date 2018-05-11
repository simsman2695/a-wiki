import * as Websocket from '../controllers/Websocket';

module.exports = (server: any) => {
    server.get('/websocket', Websocket.getWs);
};
