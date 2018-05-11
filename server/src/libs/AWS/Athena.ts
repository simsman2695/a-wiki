import * as Promise from 'bluebird';

const AWS = require('aws-sdk');
const fs = require('fs-extra');
const path = require('path');
const md5 = require('md5');

interface AthenaOptions {
    collection: string;
    database: string;
    region: string;
}

interface AthenaError {
    code: number;
    message: string;
}

/**
 * Promised based helper class for AWS Athena
 */

export class Athena {

    public errors: Array<AthenaError>;
    private options: AthenaOptions;
    private athena: any;
    private s3: any;

    constructor(options: AthenaOptions) {
        this.options = options;
        this.athena = new AWS.Athena({apiVersion: '2017-05-18', region: this.options.region});
        this.s3 = new AWS.S3();

    }

    /**
     * Performs authentication per user and image provided
     *
     * @param {string} user
     * @param {string} image
     * @returns {Bluebird<any>}
     */
    public query(sql: string) {
        const date = new Date();
        const seconds = date.getSeconds();
        return new Promise((resolve: Function, reject: Function) => {
            try {
                this.startQuery(sql, seconds)
                    .then((queryId) => {
                        this.getResult(queryId)
                            .then((queryResult) => {
                                const data = this.parseRows(queryResult);
                                resolve({queryId, data});

                            })
                            .catch((err: Error) => {
                                reject(err);
                            });
                    })
                    .catch((err: Error) => {
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });

    }

    public getStatus(queryId: string, resolve: Function, reject: Function) {
        const params = {
            QueryExecutionId: queryId
        };
        this.athena.getQueryExecution(params, (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                const state = result.QueryExecution.Status.State;
                if (state === 'RUNNING' || state === 'QUEUED') {
                    setTimeout(
                        () => {

                            this.getStatus(queryId, resolve, reject);
                        },
                        500);
                } else if (state === 'SUCCEEDED') {
                    this.getQueryResults(queryId, resolve, reject);
                } else {
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
    public getResult(queryId: any) {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                this.getStatus(queryId, resolve, reject);
            } catch (e) {
                reject(e);
            }

        });
    }

    private parseRows = (data: any) => {
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
    }

    private getRowData = (data: any, columns: any) => {
        console.log(data);
        console.log(columns);
        let row: any = {};
        for (let i in columns) {
            if (data[i]) {
                const keys = Object.keys(data[i]);
                row[columns[i]] = data[i][keys[0]];
            }
        }
        return row;
    }

    private getColumns = (data: any) => {
        let columns = [];
        for (let i in data.Data) {
            if (i) {
                const keys = Object.keys(data.Data[i]);
                columns.push(data.Data[i][keys[0]]);
            }
        }

        return columns;
    }

    private getQueryResults = (queryId: string, resolve: Function, reject: Function) => {
        const params = {
            QueryExecutionId: queryId,
        };
        this.athena.getQueryResults(params, (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }

    /**
     * Start query
     *
     * @param {string} sql
     * @returns {Bluebird<any>}
     */
    private startQuery = (sql: string, uniquefier: any) => {
        return new Promise((resolve: Function, reject: Function) => {
            const params = {
                    QueryString: sql,
                    ResultConfiguration: {
                        OutputLocation: `s3://${this.options.collection}/QueryResults`,
                    },
                    ClientRequestToken: md5(sql) + uniquefier,
                    QueryExecutionContext: {
                        Database: this.options.database
                    }
                }
            ;
            this.athena.startQueryExecution(params, (err: Error, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.QueryExecutionId);
                }
            });
        });
    }

}
