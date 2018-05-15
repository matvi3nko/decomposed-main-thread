/**
 * Created by Nikolay Matvienko on 4/15/18.
 */
'use strict';

const fork = require('child_process').fork;

class ProcessPool {
    constructor (file, poolMax) {
        this._file = file;
        this._poolMax = poolMax;
        this._pool = [];
        this._active = [];
        this._waiting = [];
    }

    exec (callback) {
        let worker;
        if (this._pool.length > 0) {
           
            worker = this._pool.pop();
            this._active.push(worker);
            return process.nextTick(callback.bind(null, null, worker));
        }
        if (this._active.length >= this._poolMax) {
            return this._waiting.push(callback);
        }

        worker = fork(this._file);

        this._active.push(worker);
        process.nextTick(callback.bind(null, null, worker));
    }

    release (worker) {
        if (this._waiting.length > 0) {
            const waitingCallback = this._waiting.shift();
            waitingCallback(null, worker);
        }

        this._active = this._active.filter(w => worker !== w);
        this._pool.push(worker);
    }
}

module.exports = ProcessPool;