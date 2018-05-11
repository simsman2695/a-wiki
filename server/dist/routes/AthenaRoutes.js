"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Athena = require("../controllers/Athena");
module.exports = (server) => {
    server.post('/athena', Athena.query);
};
//# sourceMappingURL=AthenaRoutes.js.map