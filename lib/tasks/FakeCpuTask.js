class CpuTask {
    constructor(sum, set) {
        this.sum = sum;
        this.set = set;
    }

    start () {
        return Promise.resolve([this.set]);
    }
}

module.exports = CpuTask;
