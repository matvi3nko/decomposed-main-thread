class CpuTask {
    constructor(sum, set) {
        this.sum = sum;
        this.set = set;
        this.totalSubsets = 0;
        this.result = [];
    }

    _combine (set, subset) {
        for (let i = 0; i < set.length; i++) {
            let newSubset = subset.concat(set[i]);
            this._combine(set.slice(i + 1), newSubset);

            if (this._processSubset(newSubset)) {
                this.result.push(subset);
            }
        }
    }

    _processSubset (subset) {
        //console.log('Subset', ++this.totalSubsets, subset);
        const result = subset.reduce((prev, item) => (prev + item), 0);
        
        return result == this.sum;
    }

    start () {
        return new Promise((resolve, reject) => {
            this._combine(this.set, []);
            resolve(this.result);
        });
    }
}

module.exports = CpuTask;
