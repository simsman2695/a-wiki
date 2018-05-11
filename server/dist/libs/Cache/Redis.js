"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require('redis');
const Promise = require('bluebird');
const client = redis.createClient('redis://' +
    'h:p5f5f1f01bfcf6b784c7e15db5d46dd84e09f62647e00158efd1ea73931f602d2@' +
    'ec2-34-237-158-248.compute-1.amazonaws.com:39939');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
/**
 * Redis cache helper lib
 *
 * Turns redis client in to a promise based client
 */
class Redis {
    /**
     * Async get redis key function
     *
     * @param {string} key
     * @returns {Promise<{}>}
     */
    get(key) {
        return client.getAsync(key);
    }
    /**
     * Async delete redis key function
     *
     * @param {string} key
     * @returns {Promise<{}>}
     */
    del(key) {
        return client.delAsync(key);
    }
    /**
     * Async set redis key function
     *
     * @param {string} key
     * @param {string} value
     * @param {number} time
     * @returns {Promise<{}>}
     */
    set(key, value, time = 60) {
        return client.setAsync(key, value, 'EX', time);
    }
}
exports.Redis = Redis;
//# sourceMappingURL=Redis.js.map