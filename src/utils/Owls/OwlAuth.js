import { Owls } from './Owls';

export class OwlAuth extends Owls {

    constructor () {
        super();
        this.setUrl();
    }

    public Query (credentials) {
        const body = { username: credentials.username, password: credentials.password };
        return this.post(this.url, body);
    }

    private setUrl () {
        this.url = this.url + '/authenticate';
    }

}
