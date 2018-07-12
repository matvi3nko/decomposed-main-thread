'use strict';

//const fsPromises = require('fs/promises');
const fsPromises = {};

class AsyncFsTask {
    constructor (name, data) {
        this._name = name;
        this._data = data;
    }

    start () {
        let res = '';
        for(let i=0; i<100; i++) {
            res += this._data;
        }

        return fsPromises.writeFile(this._name, res).then(
            text => text || this._data
        );
    }
}

module.exports = AsyncFsTask;