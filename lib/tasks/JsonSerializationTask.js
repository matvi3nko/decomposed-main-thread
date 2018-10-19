'use strict';

class JsonSerializationTask {
    constructor(set) {
        this._set = set;
    }

    encode () {
        return new Promise((resolve, reject) => {
            resolve(JSON.stringify(this._set));
        });
    }

    decode () {
        return new Promise((resolve, reject) => {
            const result = JSON.parse(this._set);
            resolve(result.list.length.toString());
        });
    }
}

module.exports = JsonSerializationTask;
