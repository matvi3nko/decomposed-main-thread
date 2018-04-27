/**
 * Created by Nikolay Matvienko on 4/26/18.
 */
'use strict';

const createExpressServer = require('./express');
const createFastifyServer = require('./fastify');
const serverCluster = require('./serverCluster');

const FakeTask = require('./fakes/FakeCpuTask');
const CpuTask = require('./tasks/CpuTask');
const ParallelCpuTask = require('./tasks/ParallelCpuTask');
const config = require('../config');

const FakeLogger = require('./fakes/FakeLogger');
const fakeLogger = new FakeLogger();

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

module.exports.express = function () {
    createExpressServer(config, fakeLogger, FakeTask);
    console.info(`
        Server: Express
        Logger: Console
        CpuTask: ––
        APM: ––
    `);
};

module.exports.fastify = function () {
    createFastifyServer(config, fakeLogger, FakeTask);
    console.info(`
        Server: Fastify
        Logger: Console
        CpuTask: ––
        APM: ––
    `);
};

module.exports.napa = function () {
    createNapaFastifyServer(config, fakeLogger, FakeTask);
    console.info(`
        Server: Fastify
        Logger: Console
        CpuTask: ––
        APM: ––
    `);
};

module.exports.case1 = function () {
    createExpressServer(config, winstonLogger, CpuTask);
    console.info(`
        Server: Express
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case2 = function () {
    createFastifyServer(config, winstonLogger, CpuTask);
    console.info(`
        Server: Fastify
        Logger: Winston
        CpuTask: In-process
        APM: NewRelic
    `);
};

module.exports.case3 = function () {
    createFastifyServer(config, pinoLogger, CpuTask);
    console.info(`
        Server: Fastify
        Logger: Pino
        CpuTask: In-process
        APM: ––
    `);
};

module.exports.case4 = function () {
    createFastifyServer(config, pinoLogger, ParallelCpuTask);
    console.info(`
        Server: Fastify
        Logger: Pino
        CpuTask: Parallel
        APM: ––
    `);
};

module.exports.case5 = function () {
    serverCluster(() => {
        createExpressServer(config, winstonLogger, CpuTask);
            console.info(`
                Server: Express worker
                Logger: Winston
                CpuTask: In-process
                APM: NewRelic
        `);
    });
};

module.exports.case6 = function () {
    serverCluster(() => {
        createFastifyServer(config, pinoLogger, CpuTask);
        console.info(`
                Server: Fastify worker
                Logger: Pino
                CpuTask: In-process
                APM: NewRelic
        `);
    });
};

module.exports.case7 = function () {
    serverCluster(() => {
        createFastifyServer(config, pinoLogger, CpuTask);
        console.info(`
                Server: Fastify worker
                Logger: Pino
                CpuTask: In-process
                APM: ––
        `);
    });
};

module.exports.case8 = function () {
    serverCluster(() => {
        createFastifyServer(config, pinoLogger, ParallelCpuTask);
        console.info(`
                Server: Fastify worker
                Logger: Pino
                CpuTask: Parallel
                APM: ––
        `);
    });
};

module.exports.case9 = function () {
    serverCluster(() => {
        createExpressServer(config, pinoLogger, ParallelCpuTask);
        console.info(`
                Server: Express worker
                Logger: Pino
                CpuTask: Parallel
                APM: ––
        `);
    });
};