import { streamer } from '../Streamer';
import * as config from '../config';

module.exports = (kinesis: any) => {
    streamer(kinesis, config.Retorts);
};
