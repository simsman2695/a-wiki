"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Owls_1 = require("./Owls");
class OwlAuth extends Owls_1.Owls {
    constructor() {
        super();
        this.setUrl();
    }
    Query(credentials) {
        const body = { username: credentials.username, password: credentials.password };
        return this.post(this.url, body);
    }
    setUrl() {
        this.url = this.url + '/authenticate';
    }
}
exports.OwlAuth = OwlAuth;
//# sourceMappingURL=OwlAuth.js.map