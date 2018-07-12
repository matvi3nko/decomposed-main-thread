'use strict';

class EmptyTask {
    constructor(sum, set, delay) {
        this._sum = sum;
        this._set = set;
        this._delay = set;
    }

    start () {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve([this._set]);
            }, this._delay);
        });
    }
}

module.exports = EmptyTask;
