'use strict';

class EmptyTask {
    constructor(sum, set) {
        this.sum = sum;
        this.set = set;
    }

    start () {
        return Promise.resolve([this.set]);
    }
}

module.exports = EmptyTask;
