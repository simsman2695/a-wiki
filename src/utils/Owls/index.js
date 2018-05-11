import { OwlAuth } from './OwlAuth';

/**
 * Helper function for Owls lib
 *
 * @param {Owls.OwlAuthRequest} credentials
 * @returns {Promise<Promise<Response>>}
 */

export const authenticate = (credentials) => {
    const Auth = new OwlAuth();
    return Auth.Query(credentials);
};

const Owls = {
    authenticate: authenticate
};

export default Owls;
