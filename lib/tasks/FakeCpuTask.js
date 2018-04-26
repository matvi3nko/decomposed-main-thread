class CpuTask {
    constructor(sum, set) {
        this.sum = sum;
        this.set = set;
    }

    start () {
        return Promise.res(this.sum);
    }
}

module.exports = CpuTask;
