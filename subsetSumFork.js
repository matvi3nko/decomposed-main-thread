/**
 * Created by Nikolay Matvienko on 4/15/18.
 */

const EventEmitter = require('events').EventEmitter;
const ProcessPool = require('./processPool');
const processPool = new ProcessPool(__dirname + '/subsetSumWorker.js', 2);

//const processPool = new ProcessPool(__dirname + '/sub.js', 2);

class SubsetSumFork extends EventEmitter {
    constructor (sum, set) {
        super();
        this.sum = sum;
        this.set = set;
    }

    start () {
        processPool.acquire((err, worker) => {
            worker.send({ sum: this.sum, set: this.set });
            const onMessage = (msg) => {
                if (msg.event === 'end') {
                    // [3]
                    worker.removeListener('message', onMessage);
                    processPool.release(worker);
                }

                this.emit(msg.event, msg.data);
            };
            worker.on('message', onMessage);
        });
    }
}

module.exports = SubsetSumFork;