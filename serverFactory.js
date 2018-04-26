/**
 * Created by Nikolay Matvienko on 4/26/18.
 */
'use strict';

const createExpressServer = require('./express');
const createFastifyServer = require('./fastify');
const serverCluster = require('./serverCluster');


const CpuTask = require('./processPool/cpuTask');
const ParallelCpuTask = require('./processPool/parallelCpuTask');
const config = require('./config');

//Logger
const pinoLogger = require('pino')();

//Logger
const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');

const esTransportOpts = {
    level: 'info'
};
const winstonLogger = new winston.createLogger({
    transports: [
        new Elasticsearch(esTransportOpts)
    ]
});

// module.exports.createServer = function () {
//     const case1 = createExpressServer(config, winstonLogger, CpuTask, nr);
//     const case2 = createFastifyServer(config, winstonLogger, CpuTask);
//     const case3 = createFastifyServer(config, pinoLogger, CpuTask);
//
//     const case4 = createFastifyServer(config, pinoLogger, ParallelCpuTask);
//
//     const case5 = serverCluster(() => createExpressServer(config, winstonLogger, CpuTask, nr));
// };

module.exports.case1 = function () {
    const server = createExpressServer(config, winstonLogger, CpuTask);
    console.info(`
        Server: Express
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case2 = function () {
    const server = createFastifyServer(config, winstonLogger, CpuTask);
    console.info(`
        Server: Fastify
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case3 = function () {
    const server = createFastifyServer(config, pinoLogger, CpuTask);
    console.info(`
        Server: Fastify
        Logger: Pino
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case4 = function () {
    const server = createFastifyServer(config, pinoLogger, CpuTask);
    console.info(`
        Server: Fastify
        Logger: Pino
        CpuTask: Parallel
        APM: ––
    `);
};

module.exports.case5 = function () {
    const server = serverCluster(() => createExpressServer(config, winstonLogger, CpuTask));
    console.info(`
        Server: Express Cluster
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};