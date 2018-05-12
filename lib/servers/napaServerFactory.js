/**
 * Created by Nikolay Matvienko on 4/27/18.
 */
'use strict';


const napa = require("napajs");

const NUMBER_OF_WORKERS = 4;

const zone = napa.zone.create('zone', { workers: NUMBER_OF_WORKERS });

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

// Broadcast declaration of 'napa' and 'zone' to napa workers.
zone.broadcast(' \
    var napa = require("napajs"); \
    var zone = napa.zone.get("zone"); \
');
// Broadcast function declaration of 'cpuTaskFunc' to napa workers.
zone.broadcast(cpuTaskFunc.toString());

module.exports = function createServer (config) {
    const { routes, port, cpuData, logData } = config;
    let reqCounter = 0;

    routes.forEach(route => {
        fastify.get(`/${route}`, schema, (req, res) => {
            res.send({ greeting: 'Hello HolyJS!' });
        });
    });

    fastify.get('/cpu',  cpuSchema, function (req, reply) {
        zone.execute( '', "cpuTaskFunc", [cpuData.micro.sum, [...cpuData.micro.set, reqCounter++]])
            .then((result) => {
                return reply.send(result.value);
            })
            .catch(error => {
                process.stderr.write(`Err: ${error}`);
                reply.send(error);
            });
    });

    fastify.get('/cpu/macro', cpuSchema, function (req, reply) {
        zone.execute( '', "cpuTaskFunc", [cpuData.macro.sum, [...cpuData.macro.set, reqCounter++]])
            .then((result) => {
                return reply.send(result.value);
            })
            .catch(error => {
                process.stderr.write(`Err: ${error}`);
                reply.send(error);
            });
    });

    fastify.listen(port, err => {
        if (err) throw err;
        console.log(`Fastify+napa server pid:${process.pid} listening on port ${port}!\n`);
    });

    return fastify;
};

function cpuTaskFunc (sum, setVal) {
    let _result = [];

    let _processSubset  = function (subset) {
        const result = subset.reduce((prev, item) => (prev + item), 0);
        return result === sum;
    };

    let _combine = function (set, subset) {
        for (let i = 0; i < set.length; i++) {
            let newSubset = subset.concat(set[i]);
            _combine(set.slice(i + 1), newSubset);

            if (_processSubset(newSubset)) {
                _result.push(subset);
            }
        }
    };

    _combine(setVal, []);
    return _result;
}
