const fs = require('fs-extra');
const util = require('util');
require('util.promisify').shim();
const exec = util.promisify(require('child_process').exec);

const run = () => {
    if (!fs.existsSync('./init.sh')) {
        setTimeout(
            () => {
                run();
            },
            1000);
    } else {

        async function ls() {
            const { stdout, stderr } = await exec('./init.sh');
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        }

        ls();
    }
};
