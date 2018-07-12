'use strict';

const fastify = require('fastify')();
const schema = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    greeting: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
const cpuSchema = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        }
    }
};
const asyncSchema = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            '5xx': {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
const biglogSchema = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    value: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
const logSchema = {
    schema: {
        response: {
            200: {
                type: 'string'
            },
        }
    }
};
const simpleSchema = {
    schema: {
        response: {
            200: {
                type: 'number'
            }
        }
    }
};

const controllerFactory = require('../controllers/controllerFactory');

module.exports = function createServer (config, logger, CpuTask, AsyncTasksQueue) {
    const { routes, port, cpuData, logData } = config;

    const controller = controllerFactory(logger, CpuTask, AsyncTasksQueue);

    routes.forEach(route => {
        fastify
            .get(`/${route}`, schema, controller.home);
    });

    fastify.get('/cpu', cpuSchema, function (req, reply) {
        req.data = { sum: cpuData.micro.sum, set: cpuData.micro.set };
        return controller.cpu(req, reply);
    });

    fastify.get('/cpu/macro', cpuSchema, function (req, reply) {
        req.data = { sum: cpuData.macro.sum, set: cpuData.macro.set };
        return controller.cpu(req, reply)
    });

    fastify.get('/async', asyncSchema, function (req, reply) {
        req.data = { set: cpuData.macro.set };

        return controller.libuv(req, reply);
    });

    fastify.get('/log', logSchema, function (req, reply) {
        req.metaData = { method: req.raw.method, url: req.raw.url, headers: req.headers };
        controller.log(req, reply)
    });

    fastify.get('/biglog', biglogSchema, function (req, reply) {
        req.data = logData;
        controller.bigLog(req, reply);
    });

    fastify.get('/interop', simpleSchema, function (req, reply) {
        req.data = logData;
        return controller.interop(req, reply);
    });

    fastify.get('/holy', cpuSchema, function (req, reply) {
        req.metaData = { method: req.raw.method, url: req.raw.url, headers: req.headers };
        req.data = cpuData;
        req.logData = logData;
        return controller.holy(req, reply);
    });

    fastify.listen(port, err => {
        if (err) throw err;
        // Used stderr since stdout piped to external logger app
        process.stderr.write(`Fastify server pid:${process.pid} listening on port ${port}!\n`);
    });

    return fastify;
};