'use strict';

const cluster = require('cluster');
const os = require('os');

module.exports = function (startWorker) {
    if (cluster.isMaster) {
        const cpus = os.cpus().length;

        for (let i = 0; i < cpus; i++) {
            cluster.fork();
        }

        console.info(`
            Server: Express cluster with ${cpus} workers
        `);
    } else {
        startWorker();
    }
};