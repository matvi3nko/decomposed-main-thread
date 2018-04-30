/**
 * Created by Nikolay Matvienko on 4/26/18.
 */
'use strict';

//Configuration
const config = require('../config');

//Web Servers
const createExpressServer = require('./servers/express');
const createFastifyServer = require('./servers/fastify');
const startCluster = require('./servers/сluster');

//Tasks
const FakeTask = require('./tasks/FakeTask');
const CpuTask = require('./tasks/CpuTask');
const ParallelCpuTask = require('./tasks/ParallelCpuTask');
const AsyncFsTask = require('./tasks/AsyncFsTask');
const AsyncCryptoTask = require('./tasks/AsyncCryptoTask');
const AsyncTasksQueue = require('./tasks/AsyncTasksQueue');

//Loggers
const pinoLogger = require('./loggers/pinoLoggerFactory')();
const winstonLogger = require('./loggers/winstonLoggerFactory')();
const consoleLogger = require('./loggers/consoleLoggerFactory')();
const stdOutStreamLogger = require('./loggers/stdOutStreamLoggerFactory')();

//Configurations of Web Servers Cases
module.exports.express = function () {
    createExpressServer(config, consoleLogger, FakeTask);
    process.stderr.write(`
        Server: Express
        Logger: Console
        CpuTask: ––
        APM: ––
    `);
};

module.exports.fastify = function () {
    createFastifyServer(config, consoleLogger, FakeTask);
    process.stderr.write(`
        Server: Fastify
        Logger: Console
        CpuTask: ––
        APM: ––
    `);
};

module.exports.case1 = function () {
    createExpressServer(config, winstonLogger, CpuTask, AsyncTasksQueue);
    process.stderr.write(`
        Server: Express
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case2 = function () {
    createFastifyServer(config, winstonLogger, CpuTask, AsyncTasksQueue);
    process.stderr.write(`
        Server: Fastify
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case3 = function () {
    createFastifyServer(config, pinoLogger, CpuTask, AsyncTasksQueue);
    process.stderr.write(`
        Server: Fastify
        Logger: Pino
        CpuTask: In-process
        APM: ––
    `);
};

module.exports.case4 = function () {
    createFastifyServer(config, pinoLogger, ParallelCpuTask, AsyncTasksQueue);
    process.stderr.write(`
        Server: Fastify
        Logger: Pino
        CpuTask: Parallel
        APM: ––
    `);
};

module.exports.case5 = function () {
    startCluster(() => {
        createExpressServer(config, winstonLogger, CpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Express worker
            Logger: Winston
            CpuTask: In-process
            APM: NewRelic
        `);
    });
};

module.exports.case6 = function () {
    startCluster(() => {
        createFastifyServer(config, pinoLogger, CpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Fastify worker
            Logger: Pino
            CpuTask: In-process
            APM: NewRelic
        `);
    });
};

module.exports.case7 = function () {
    startCluster(() => {
        createFastifyServer(config, pinoLogger, CpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Fastify worker
            Logger: Pino
            CpuTask: In-process
            APM: ––
        `);
    });
};

module.exports.case8 = function () {
    startCluster(() => {
        createFastifyServer(config, pinoLogger, ParallelCpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Fastify worker
            Logger: Pino
            CpuTask: Parallel
            APM: ––
        `);
    });
};

module.exports.case9 = function () {
    startCluster(() => {
        createExpressServer(config, pinoLogger, ParallelCpuTask, AsyncTasksQueue);
        process.stderr.write(`
                Server: Express worker
                Logger: Pino
                CpuTask: Parallel
                APM: ––
        `);
    });
};

module.exports.case10 = function () {
    startCluster(() => {
        createExpressServer(config, consoleLogger, CpuTask, AsyncTasksQueue);
        process.stderr.write(`
        Server: Express worker
        Logger: FakeLogger
        CpuTask: CpuTask
        AsyncTask: AsyncTasksQueue
        APM: ––
    `);
    });
};