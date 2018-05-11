"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const AWS = require('aws-sdk');
const fs = require('fs-extra');
const path = require('path');
const md5 = require('md5');
/**
 * Promised based helper class for AWS Athena
 */
class Athena {
    constructor(options) {
        this.parseRows = (data) => {
            const columns = this.getColumns(data.ResultSet.Rows[0]);
            let rows = [];
            for (let i in data.ResultSet.Rows) {
                if (i) {
                    console.log(i);
                    rows.push(this.getRowData(data.ResultSet.Rows[i].Data, columns));
                }
            }
            rows.shift();
            return rows;
        };
        this.getRowData = (data, columns) => {
            console.log(data);
            console.log(columns);
            let row = {};
            for (let i in columns) {
                if (data[i]) {
                    const keys = Object.keys(data[i]);
                    row[columns[i]] = data[i][keys[0]];
                }
            }
            return row;
        };
        this.getColumns = (data) => {
            let columns = [];
            for (let i in data.Data) {
                if (i) {
                    const keys = Object.keys(data.Data[i]);
                    columns.push(data.Data[i][keys[0]]);
                }
            }
            return columns;
        };
        this.getQueryResults = (queryId, resolve, reject) => {
            const params = {
                QueryExecutionId: queryId,
            };
            this.athena.getQueryResults(params, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        };
        /**
         * Start query
         *
         * @param {string} sql
         * @returns {Bluebird<any>}
         */
        this.startQuery = (sql, uniquefier) => {
            return new Promise((resolve, reject) => {
                const params = {
                    QueryString: sql,
                    ResultConfiguration: {
                        OutputLocation: `s3://${this.options.collection}/QueryResults`,
                    },
                    ClientRequestToken: md5(sql) + uniquefier,
                    QueryExecutionContext: {
                        Database: this.options.database
                    }
                };
                this.athena.startQueryExecution(params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result.QueryExecutionId);
                    }
                });
            });
        };
        this.options = options;
        this.athena = new AWS.Athena({ apiVersion: '2017-05-18', region: this.options.region });
        this.s3 = new AWS.S3();
    }
    /**
     * Performs authentication per user and image provided
     *
     * @param {string} user
     * @param {string} image
     * @returns {Bluebird<any>}
     */
    query(sql) {
        const date = new Date();
        const seconds = date.getSeconds();
        return new Promise((resolve, reject) => {
            try {
                this.startQuery(sql, seconds)
                    .then((queryId) => {
                    this.getResult(queryId)
                        .then((queryResult) => {
                        const data = this.parseRows(queryResult);
                        resolve({ queryId, data });
                    })
                        .catch((err) => {
                        reject(err);
                    });
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getStatus(queryId, resolve, reject) {
        const params = {
            QueryExecutionId: queryId
        };
        this.athena.getQueryExecution(params, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                const state = result.QueryExecution.Status.State;
                if (state === 'RUNNING' || state === 'QUEUED') {
                    setTimeout(() => {
                        this.getStatus(queryId, resolve, reject);
                    }, 500);
                }
                else if (state === 'SUCCEEDED') {
                    this.getQueryResults(queryId, resolve, reject);
                }
                else {
                    reject(result);
                }
            }
        });
    }
    /**
     * Performs authentication per user and video provided
     *
     * @param {string} queryId
     * @param {string} video
     * @returns {Bluebird<any>}
     */
    getResult(queryId) {
        return new Promise((resolve, reject) => {
            try {
                this.getStatus(queryId, resolve, reject);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.Athena = Athena;
//# sourceMappingURL=Athena.js.map