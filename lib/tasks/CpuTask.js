'use strict';

class CpuTask {
    constructor(sum, set) {
        this._sum = sum;
        this._set = set;
        this._result = [];
    }

    _combine (set, subset) {
        for (let i = 0; i < set.length; i++) {
            let newSubset = subset.concat(set[i]);
            this._combine(set.slice(i + 1), newSubset);

            if (this._processSubset(newSubset)) {
                this._result.push(subset);
            }
        }
    }

    _processSubset (subset) {
        const result = subset.reduce((prev, item) => (prev + item), 0);
        
        return result === this._sum;
    }

    start () {
        return new Promise((resolve, reject) => {
            //let start = Date.now();
            this._combine(this._set, []);
            //let end = Date.now();
            //console.log(end-start);
            resolve(this._result);
        });
    }
}

module.exports = CpuTask;
