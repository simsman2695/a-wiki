/***
 Copyright 2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Amazon Software License (the "License").
 You may not use this file except in compliance with the License.
 A copy of the License is located at
 http://aws.amazon.com/asl/
 or in the "license" file accompanying this file. This file is distributed
 on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 ***/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require('log4js');
exports.logger = () => {
    const logDir = process.env.NODE_LOG_DIR !== undefined ? process.env.NODE_LOG_DIR : '.';
    const config = {
        appenders: {
            application: {
                type: 'file',
                filename: logDir + '/' + 'application.log',
                pattern: '-yyyy-MM-dd',
                layout: {
                    type: 'pattern',
                    pattern: '%d (PID: %x{pid}) %p %c - %m',
                    tokens: {
                        pid: () => {
                            return process.pid;
                        }
                    }
                }
            }
        },
        categories: {
            default: {
                appenders: ['application'],
                level: 'error'
            }
        }
    };
    log4js.configure(config, {});
    return {
        getLogger: () => {
            return log4js.getLogger('application');
        }
    };
};
//# sourceMappingURL=logger.js.map