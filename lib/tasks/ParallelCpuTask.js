/**
 * Created by Nikolay Matvienko on 4/15/18.
 */
'use strict';

const ProcessPool = require('./ProcessPool');
const processPool = new ProcessPool(__dirname + '/cpuTaskWorker.js', 1);

class ParallelCpuTask {
    constructor (sum, set) {
        this.sum = sum;
        this.set = set;
    }

    start () {
        return new Promise((resolve, reject) => {
            processPool.exec((err, worker) => {
                worker.send({ sum: this.sum, set: this.set });

                const onMessage = msg => {
                    if (msg.event === 'end') {
                        processPool.release(worker);
                    } else if (msg.event === 'error') {
                        reject(msg.error);
                    }

                    resolve(msg.data);
                };

                worker.once('message', onMessage);
            });
        });
    }
}

module.exports = ParallelCpuTask;