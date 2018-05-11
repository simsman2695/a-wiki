import fetch from 'node-fetch';
import * as https from 'https';

/**
 * Agent to ignore SSL certificate
 *
 * @type {"https".Agent}
 */
const agent = new https.Agent({
    rejectUnauthorized: false
});

/**
 * Owls library for interacting with Owls API
 */

export class Owls {

    public user;
    public url;
    private apiUser;
    private apiKey;
    private baseUrl;
    private version;
    private headers;

    constructor() {
        this.initConfig();
        this.initHeaders();
        this.setBaseUrl();
    }

    async get(url) {
        return fetch(url, { method: 'GET', headers: this.headers, agent: agent });
    }

    async post(url, requestBody = {}) {
        this.headers['content-type'] = 'application/x-www-form-urlencoded';

        const body = [];
        for (let i in requestBody) {
            if (typeof requestBody[i] === 'string') {
                body.push(`${i}=${requestBody[i]}`);
            }
        }

        return fetch(
            url,
            {
                method: 'POST',
                body: body.join('&'),
                headers: this.headers,
                agent: agent
            }
        );

    }

    public setBaseUrl() {
        this.url = this.baseUrl + '/' + this.version + '/owls';
    }

    public initHeaders() {
        this.headers = {};
        this.headers.credentials = 'same-origin';
        this.headers.authorization = 'Basic ' + new Buffer(this.apiUser + ':' + this.apiKey).toString('base64');
    }

    private initConfig() {
        this.baseUrl = process.env.OWLS_API_URL;
        this.apiUser = process.env.OWLS_API_USER;
        this.apiKey = process.env.OWLS_API_KEY;
        this.version = process.env.OWLS_API_VERSION;
    }

}
