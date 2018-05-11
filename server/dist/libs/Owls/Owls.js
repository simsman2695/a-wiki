"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const https = require("https");
/**
 * Agent to ignore SSL certificate
 *
 * @type {"https".Agent}
 */
const agent = new https.Agent({
    rejectUnauthorized: false,
});
/**
 * Owls library for interacting with Owls API
 */
class Owls {
    constructor() {
        this.initConfig();
        this.initHeaders();
        this.setBaseUrl();
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return node_fetch_1.default(url, { method: 'GET', headers: this.headers, agent: agent });
        });
    }
    post(url, requestBody = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.headers['content-type'] = 'application/x-www-form-urlencoded';
            const body = [];
            for (let i in requestBody) {
                if (typeof requestBody[i] === 'string') {
                    body.push(`${i}=${requestBody[i]}`);
                }
            }
            return node_fetch_1.default(url, {
                method: 'POST',
                body: body.join('&'),
                headers: this.headers,
                agent: agent
            });
        });
    }
    setBaseUrl() {
        this.url = this.baseUrl + '/' + this.version + '/owls';
    }
    initHeaders() {
        this.headers = {};
        this.headers.credentials = 'same-origin';
        this.headers.authorization = 'Basic ' + new Buffer(this.apiUser + ':' + this.apiKey).toString('base64');
    }
    initConfig() {
        this.baseUrl = process.env.OWLS_API_URL;
        this.apiUser = process.env.OWLS_API_USER;
        this.apiKey = process.env.OWLS_API_KEY;
        this.version = process.env.OWLS_API_VERSION;
    }
}
exports.Owls = Owls;
//# sourceMappingURL=Owls.js.map