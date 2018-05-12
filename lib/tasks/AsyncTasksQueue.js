'use strict';

const AsyncCryptoTask = require('./AsyncCryptoTask');
const AsyncFsTask = require('./AsyncFsTask');
const AsyncDnsTask = require('./AsyncDnsTask');

class AsyncTasksQueue {
    constructor (cryptoCount = 1, fsCount = 2, dnsCount = 1, data) {
        this._cryptoCount = cryptoCount;
        this._fsCount = fsCount;
        this._dnsCount = dnsCount;
        this._data = JSON.stringify(data);
    }

    start () {
        let promisesArray = [];
        let data = "";
        for (let i = 0; i < 1000; i++) {
            data += this._data;
        }

        for (let i = 0; i < this._cryptoCount; i++) {
            promisesArray.push((new AsyncCryptoTask(this._data)).start())
        }

        for (let i = 0; i < this._dnsCount; i++) {
            promisesArray.push((new AsyncDnsTask(`abc.org.uk`)).start())
        }

        for (let i = 0; i < this._fsCount; i++) {
            promisesArray.push(
                (new AsyncFsTask(
                        `./temp/fs-task-output-${i}.txt`, data)
                ).start()
            )
        }

        return Promise.all(promisesArray);
    }
}

module.exports = AsyncTasksQueue;
