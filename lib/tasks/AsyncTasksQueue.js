'use strict';

const AsyncCryptoTask = require('./AsyncCryptoTask');
const AsyncFsTask = require('./AsyncFsTask');

class AsyncTasksQueue {
    constructor (cryptoCount = 1, fsCount = 2, data) {
        this._cryptoCount = cryptoCount;
        this._fsCount = fsCount;
        this._data = JSON.stringify(data);
    }

    start () {
        let promisesArray = [];

        for (let i = 0; i < this._cryptoCount; i++) {
            promisesArray.push((new AsyncCryptoTask(this._data)).start())
        }

        for (let i = 0; i < this._fsCount; i++) {
            promisesArray.push(
                (new AsyncFsTask(
                        `./temp/fs-task-output-${i}.txt`, this._data)
                ).start()
            )
        }

        return Promise.all(promisesArray);
    }
}

module.exports = AsyncTasksQueue;
