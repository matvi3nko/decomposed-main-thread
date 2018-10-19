/**
 * Created by Nikolay Matvienko on 5/12/18.
 */
'use strict';

const fork = require('child_process').fork;

const data = { list: []};
for (let i = 0; i < 15; i++) {
    data.list.push({
        id: i,
        data: i.toString().repeat(100),
        totalPrice: Math.ceil(Math.random() * 1000),
        items: [{ name: 'item' }]
    })
}

// for (let i = 0; i < 200; i++) {
//     data.list.push({
//         id: i,
//         priceWithDiscount: Math.random() * 1000,
//         discount: Math.ceil(Math.random() * 1000),
//         totalPrice: Math.random() * 1000,
//         items: [{ sku: Math.ceil(Math.random() * 1000) }]
//     })
// }

const serializedData = JSON.stringify(data);

const protobuf = require('protocol-buffers');
const fs = require('fs');

const protoSchema = protobuf(fs.readFileSync('./lib/schemas/OrdersWithStrings.proto'));
const encodedData = protoSchema.Payload.encode(data);

function controllerFactory (logger, CpuTask, AsyncTasksQueue, SerializationTask) {
    let reqCounter = 0;

    const worker = fork('./lib/tasks/simpleInteropWorker.js');

    return {
        home (req, res) {
            res.send({ greeting: 'Hello HolyJS!' });
        },

        holy (req, res) {
            return new Promise((resolve, reject) => {
                setTimeout(()=>{
                    let tasks = [(new CpuTask(req.data.macro.sum,
                        [...req.data.macro.set, reqCounter++])).start()];

                    for (let i = 0; i < 5; i++) {
                        logger.info(req.metaData, `Log ${reqCounter}-${i}`);
                        tasks.push((new CpuTask(req.data.micro.sum,
                            [...req.data.micro.set, reqCounter++, i])).start());
                    }

                    logger.info(req.data, 'Input data');

                    return Promise.all(tasks)
                        .then((data) => {
                            return res.send(data[0]);
                        })
                        .catch(error => {
                            process.stderr.write(`Err: ${error}`);
                            res.send(error);
                        });
                },50);
            });
        },

        cpu (req, res) {
            const cpuTask = new CpuTask(req.data.sum, [...req.data.set, reqCounter++]);

            return cpuTask.start()
                .then(result => {
                    return res.send(result);
                })
                .catch(error => {
                    process.stderr.write(`Err: ${error}`);
                    res.send(error);
                });
        },

        libuv (req, res) {
            const asyncTasksQueue = new AsyncTasksQueue(
                req.query.crypto,
                req.query.fs,
                req.query.dns,
                [...req.data.set, reqCounter++]
            );

            return asyncTasksQueue.start()
                .then(result => {
                    return res.send(result);
                })
                .catch(error => {
                    process.stderr.write(`Err: ${error}`);
                    res.send(error);
                });
        },

        log (req, res) {
            const count = req.query.count || 1;

            for (let i = 0; i < count; i++) {
                // logs method, url, headers
                logger.info(req.metaData, 'Log message');
            }

            res.send('Logged');
        },


        bigLog (req, res) {
            const count = req.query.count || 1;

            for (let i = 0; i < count; i++) {
                //send big log message
                logger.info(data, 'Big log message');
            }

            res.send('Logged');
        },

        render (req, res) {
            //In order to get long rendering it is better to bench on multiple components
        },

        interop (req, res) {
            const data = { id: reqCounter++, data };

            worker.send(data);

            worker.once('message', msg => {
                res.send(msg.data.id);
            });
        },

        api (req, res) {
            return new Promise((resolve, reject) => {
                setTimeout(()=>{
                    resolve(req.data.value);
                },0);
            });
        },

        serialize (req, res) {
            const cpuTask = new CpuTask(data);

            return cpuTask.encode()
                .then(result => {
                    return res.send(result);
                })
                .catch(error => {
                    process.stderr.write(`Err: ${error}`);
                    res.send(error);
                });
        },

        deserialize (req, res) {
            const cpuTask = new CpuTask(encodedData);

            return cpuTask.dencode()
                .then(result => {
                    return res.send(result);
                })
                .catch(error => {
                    process.stderr.write(`Err: ${error}`);
                    res.send(error);
                });
        },

        demo (req, res) {
            const tasks = [
                (new CpuTask(req.data.macro.sum, [...req.data.macro.set, reqCounter++])).start(),
                (new CpuTask(req.data.micro.sum, [...req.data.micro.set, reqCounter++])).start()
            ];

            for (let i = 0; i < 5; i++) {
                logger.info(req.metaData, `Request id:${reqCounter}`);
                logger.info(data[i], 'Log message');
            }

            return Promise.all(tasks)
                .then(result => (new SerializationTask(data)).encode())
                .then(string => (new SerializationTask(string)).decode())
                .then(result => res.send(result))
                .catch(error => {
                    process.stderr.write(`Err: ${error}.`);
                    res.send(error);
                });
        }
    }
}

module.exports = controllerFactory;
