"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OwlAuth_1 = require("./OwlAuth");
/**
 * Helper function for Owls lib
 *
 * @param {Owls.OwlAuthRequest} credentials
 * @returns {Promise<Promise<Response>>}
 */
exports.authenticate = (credentials) => {
    const Auth = new OwlAuth_1.OwlAuth();
    return Auth.Query(credentials);
};
const Owls = {
    authenticate: exports.authenticate
};
exports.default = Owls;
//# sourceMappingURL=index.js.map