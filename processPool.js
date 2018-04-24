/**
 * Created by Nikolay Matvienko on 4/15/18.
 */

const fork = require('child_process').fork;

class ProcessPool {
    constructor (file, poolMax) {
        this.file = file;
        this.poolMax = poolMax;
        this.pool = [];
        this.active = [];
        this.waiting = [];

        this._init();
    }

    _init () {
        // Begin reading from stdin so the process does not exit.
        process.stdin.resume();

        process.on('SIGINT', () => {
            console.log('Received SIGINT. Press Control-D to exit.');
        });

            // Using a single function to handle multiple signals
        function handle(signal) {
            console.log(`Received ${signal}`);

            if(this.pool.length) {
                this.pool.forEach(process => process.kill(1));
            }
            if(this.active.length) {
                this.active.forEach(process => process.kill(1));
            }
            if(this.waiting.length) {
                this.waiting.forEach(process => process.kill(1));
            }
        }

        process.on('SIGINT', handle);
        process.on('SIGTERM', handle);
    }

    acquire (callback) {
        let worker;
        if (this.pool.length > 0) {
           
            worker = this.pool.pop();
            this.active.push(worker);
            return process.nextTick(callback.bind(null, null, worker));
        }
        if (this.active.length >= this.poolMax) {
            return this.waiting.push(callback);
        }

        worker = fork(this.file);

        this.active.push(worker);
        process.nextTick(callback.bind(null, null, worker));
    }

    release (worker) {
        if (this.waiting.length > 0) {
            const waitingCallback = this.waiting.shift();
            waitingCallback(null, worker);
        }

        this.active = this.active.filter(w => worker !== w);
        this.pool.push(worker);
    }
}

module.exports = ProcessPool;