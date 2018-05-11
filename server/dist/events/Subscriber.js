"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const os = require('os');
const timers_1 = require("timers");
module.exports = (ws, wss, StreamNames) => {
    let streams = [];
    const setup = () => {
        for (let i in StreamNames) {
            if (StreamNames[i]) {
                streams[i] = {
                    name: StreamNames[i],
                    processing: false
                };
            }
        }
    };
    const start = () => {
        timers_1.setInterval(() => {
            for (let i in streams) {
                if (streams[i] && !streams[i].processing) {
                    const StreamName = streams[i].name;
                    const store = './dist/events/kinesis/stores/' + StreamName + 'Subscribers.json';
                    const consume = './dist/events/kinesis/stores/' + StreamName + 'SubscribersConsume.json';
                    let sendArray = [];
                    if (fs.existsSync(store)) {
                        streams[i].processing = true;
                        fs.copy(store, consume)
                            .then(() => {
                            const bitmap = fs.readFileSync(consume).toString('utf-8');
                            const records = bitmap.split(os.EOL);
                            for (let x in records) {
                                if (records[x]) {
                                    sendArray.push(JSON.parse(records[x]));
                                }
                            }
                            sendData(streams[i], store, sendArray);
                        })
                            .catch((err) => {
                            console.log(err);
                        });
                    }
                }
            }
        }, 500);
    };
    const sendData = (stream, store, sendArray) => {
        const toSend = JSON.stringify(sendArray);
        wss.clients.forEach(function each(client) {
            if (client.readyState === 1) {
                client.send(toSend);
            }
        });
        fs.unlink(store, (error) => {
            stream.processing = false;
            if (error) {
                console.log('failed to delete local image:' + error);
            }
        });
    };
    setup();
    start();
};
//# sourceMappingURL=Subscriber.js.map