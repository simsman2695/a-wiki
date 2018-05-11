import { server, testToken } from './server';
import * as Authenticate from '../src/controllers/Authenticate';
const request = require('supertest');

describe('Authenticate Controller', () => {
    it('Failed Authentication', () => {
        return request(server).post('/auth')
            .expect(400)
            .then((res: any) => {
                expect(typeof res.body).toBe('object');
                expect(res.body.code).toBe('BadRequest');
            });
    });
    it('Failed Token Refresh', () => {
        return request(server).post('/auth/refresh')
            .expect(401)
            .then((res: any) => {
                expect(typeof res.body).toBe('object');
                expect(res.body.code).toBe('InvalidCredentials');
            });
    });
    it('Successful Token Refresh', () => {
        return request(server).post('/auth/refresh')
            .set('Authorization', testToken)
            .expect(200)
            .then((res: any) => {
                expect(typeof res.body).toBe('object');
            });
    });
});
