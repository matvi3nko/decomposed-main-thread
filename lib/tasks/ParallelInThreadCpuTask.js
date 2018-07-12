/**
 * Created by Nikolay Matvienko on 4/15/18.
 */
'use strict';

const WORKERS_COUNT = 1;
const WorkerThreadPool = require('./WorkerThreadPool');
const threadPool = new WorkerThreadPool(__dirname + '/cpuTaskWorkerThread.js', WORKERS_COUNT);

class ParallelInThreadCpuTask {
    constructor (sum, set) {
        this.sum = sum;
        this.set = set;
    }

    start () {
        return new Promise((resolve, reject) => {
            threadPool.exec((err, worker) => {
                worker.postMessage({ sum: this.sum, set: this.set, port: worker.parentPort });

                const onMessage = msg => {
                    if (msg.event === 'end') {
                        threadPool.release(worker);
                    } else if (msg.event === 'error') {
                        reject(msg.error);
                    }

                    resolve(msg.data);
                };

                worker.once('message', onMessage);
                worker.on('error', reject);
            });
        });
    }
}

module.exports = ParallelInThreadCpuTask;