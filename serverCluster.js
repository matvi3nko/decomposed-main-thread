const cluster = require('cluster');
const os = require('os');

module.exports = function (startWorker) {
    if (cluster.isMaster) {
        const cpus = os.cpus().length;
        console.log(`Clustering to ${cpus} CPUs`);

        for (let i = 0; i< cpus; i++) {
            cluster.fork();
        }
    } else {
        startWorker();
    }
};