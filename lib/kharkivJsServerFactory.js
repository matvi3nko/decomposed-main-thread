/**
 * Created by Nikolay Matvienko on 4/26/18.
 */
'use strict';

//Configuration
const config = require('../config');

//Web Servers
const createExpressServer = require('./servers/expressServerFactory');
const createFastifyServer = require('./servers/fastifyServerFactory');
const createNapaServer = require('./servers/napaServerFactory');
const startCluster = require('./servers/сluster');

//Tasks
const FakeTask = require('./tasks/EmptyTask');
const CpuTask = require('./tasks/CpuTask');
const ParallelCpuTask = require('./tasks/ParallelCpuTask');
const ParallelInThreadCpuTask = require('./tasks/ParallelInThreadCpuTask');
const AsyncFsTask = require('./tasks/AsyncFsTask');
const AsyncCryptoTask = require('./tasks/AsyncCryptoTask');
const AsyncTasksQueue = require('./tasks/AsyncTasksQueue');
const JsonSerializationTask = require('./tasks/JsonSerializationTask');
const FastJsonStringifyTask = require('./tasks/FastJsonStringifyTask');
const ProtobufSerializationTask = require('./tasks/ProtobufSerializationTask');



//Loggers
const pinoLogger = require('./loggers/pinoLoggerFactory')();
const pinoToFileLogger = require('./loggers/pinoLoggerFactory').createWithFileTransport();
const winstonToEsLogger = require('./loggers/winstonLoggerFactory').createWithEsTransport();
const winstonToFileLogger = require('./loggers/winstonLoggerFactory').createWithFileTransport();
const consoleLogger = require('./loggers/consoleLoggerFactory')();
const stdOutStreamLogger = require('./loggers/stdOutStreamLoggerFactory')();

//Configurations of Web Servers Cases
module.exports.express = function () {
    // createExpressServer(config, consoleLogger, JsonSerializationTask);
    // createExpressServer(config, consoleLogger, FastJsonStringifyTask);
    createExpressServer(config, consoleLogger, ProtobufSerializationTask);
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

module.exports.napa = function () {
    createNapaServer(config);
    process.stderr.write(`
        Server: Napa with Fastify
        Logger: Console
        CpuTask: Parallel in Thread
        APM: ––
    `);
};

module.exports.case1 = function () {
    createExpressServer(config, winstonToEsLogger, CpuTask, AsyncTasksQueue);
    process.stderr.write(`
        Server: Express
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case2 = function () {
    createFastifyServer(config, winstonToEsLogger, CpuTask, AsyncTasksQueue);
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

module.exports.thread = function () {
    createFastifyServer(config, pinoLogger, ParallelInThreadCpuTask, AsyncTasksQueue);
    process.stderr.write(`
        Server: Fastify
        Logger: Pino
        CpuTask: ParallelInThreadCpuTask
        APM: ––
    `);
};

module.exports.case5 = function () {
    startCluster(() => {
        createExpressServer(config, winstonToEsLogger, CpuTask, AsyncTasksQueue);
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
        createFastifyServer(config, winstonToEsLogger, ParallelCpuTask, AsyncTasksQueue);
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

module.exports.case11 = function () {
    startCluster(() => {
        createNapaServer(config, pinoLogger);
        process.stderr.write(`
        Server: Napa cluster
        Logger: Pino
        CpuTask: Parallel Napa thread
        APM: ––
    `);
    });
};


module.exports.framework1 = function () {
    startCluster(() => {
        createExpressServer(config, pinoLogger, CpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Express worker
            Logger: Pino
            CpuTask: In-process
            APM: NewRelic
        `);
    });
};

module.exports.framework2 = function () {
    startCluster(() => {
        createFastifyServer(config, pinoLogger, ParallelCpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Fastify worker
            Logger: Pino
            CpuTask: Parallel
            APM: NewRelic
        `);
    });
};

module.exports.logger1 = function () {
    startCluster(() => {
        createExpressServer(config, winstonToEsLogger, ParallelCpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Express worker
            Logger: Winston To ES
            CpuTask: Parallel
            APM: NewRelic
        `);
    });
};

module.exports.logger2 = function () {
    startCluster(() => {
        createFastifyServer(config, pinoLogger, ParallelCpuTask, AsyncTasksQueue);
        process.stderr.write(`
            Server: Fastify worker
            Logger: Pino To ES
            CpuTask: Parallel
            APM: NewRelic
        `);
    });
};

module.exports.threads = function () {
    startCluster(() => {
        createFastifyServer(config, winstonToEsLogger, ParallelInThreadCpuTask, AsyncTasksQueue);
        process.stderr.write(`
        Server: Fastify
        Logger: winstonToEsLogger
        CpuTask: ParallelInThreadCpuTask
        APM: ––
    `);
    });
};