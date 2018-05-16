/**
 * Created by Nikolay Matvienko on 5/12/18.
 */
'use strict';

const fork = require('child_process').fork;

function controllerFactory (logger, CpuTask, AsyncTasksQueue) {
    let reqCounter = 0;

    const worker = fork('./lib/tasks/simpleInteropWorker.js');

    return {
        home (req, res) {
            res.send({ greeting: 'Hello HolyJS!' });
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
                logger.info(req.data, 'Big log message');
            }

            res.send('Logged');
        },

        interop (req, res) {
            const data = {id: reqCounter++, logData: req.data };

            worker.send(data);

            worker.once('message', msg => {
                res.send(msg.data.id);
            });
        },

        render (req, res) {
            //In order to get long rendering it is better to bench on multiple components
        }
    }
}

module.exports = controllerFactory;
