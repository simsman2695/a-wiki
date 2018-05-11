module.exports = (server: any) => {
    require('./AuthenticateRoutes')(server);
    require('./WebsocketRoutes')(server);
};
