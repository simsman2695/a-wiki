module.exports = (server) => {
    require('./AuthenticateRoutes')(server);
    require('./WebsocketRoutes')(server);
};
//# sourceMappingURL=index.js.map