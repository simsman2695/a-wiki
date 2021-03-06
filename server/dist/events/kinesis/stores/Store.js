"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require('util');
const fs = require('fs-extra');
const os = require('os');
exports.write = (stream, data) => {
    const store = './dist/libs/kinesis/stores/' + stream + '.json';
    const sensor = 'sensor-' + Math.floor(Math.random() * 100000);
    const ts = Math.round((new Date()).getTime() / 1000);
    data.ts = ts;
    const record = JSON.stringify({
        data: data,
        sensor: sensor,
        ts: ts
    });
    if (!fs.existsSync(store)) {
        fs.writeFileSync(store, record + os.EOL);
    }
    else {
        fs.appendFile(store, record + os.EOL);
    }
};
exports.batchWrite = (stream, data) => {
    for (let x in data) {
        if (data[x]) {
            exports.write(stream, data[x]);
        }
    }
};
//# sourceMappingURL=Store.js.map