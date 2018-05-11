"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Streamer_1 = require("../Streamer");
const config = require("../config");
module.exports = (kinesis) => {
    Streamer_1.streamer(kinesis, config.Intents);
};
//# sourceMappingURL=Intents.js.map