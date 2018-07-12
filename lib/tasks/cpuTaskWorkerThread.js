/**
 * Created by Nikolay Matvienko on 4/15/18.
 */
'use strict';

const CpuTask = require('./CpuTask');


const { parentPort } = require('worker_threads');

parentPort.on('message', (value) => {

    const cpuTask = new CpuTask(value.sum, value.set);

    cpuTask.start()
        .then(data => {
            parentPort.postMessage({ event: 'end', data: data });
        })
        .catch(error => {
            parentPort.postMessage({ event: 'error', error: error });
        })
});