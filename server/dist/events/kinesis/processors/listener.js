var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs-extra');
const util = require('util');
require('util.promisify').shim();
const exec = util.promisify(require('child_process').exec);
const run = () => {
    if (!fs.existsSync('./init.sh')) {
        setTimeout(() => {
            run();
        }, 1000);
    }
    else {
        function ls() {
            return __awaiter(this, void 0, void 0, function* () {
                const { stdout, stderr } = yield exec('./init.sh');
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
            });
        }
        ls();
    }
};
//# sourceMappingURL=listener.js.map