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
                    type: 'array',
                    items: {
                        type: 'number'
                    }
                }
            }
        }
    }
};

let counter = 0;

module.exports = function createServer (config, logger, CpuTask) {
    const { routes, port, data, sum } = config;

    routes.forEach(route => {
        fastify
            .get(`/${route}`, schema, function (req, reply) {
                reply
                    .send({ greeting: 'Hello HolyJS!' })
            });
    });

    fastify.get('/cpu',  cpuSchema, function (req, reply) {
        const subsetSum = new CpuTask(sum, [...data, counter++]);

        return subsetSum.start()
            .then(result => {
                const meta = { method: req.raw.method, url: req.raw.url, headers: req.headers };

                logger.info(meta, 'Pino log');

                return reply.send(result);
            })
            .catch(error => {
                console.error(error);
                reply.send(error);
            });
    });

    fastify.listen(port, err => {
        if (err) throw err;
        console.log(`Server process: ${process.pid}`);
        console.log(`Fastify server listening on port ${port}!`);
    });

    return fastify;
};