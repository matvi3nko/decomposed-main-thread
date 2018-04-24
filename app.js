/**
 * Created by Nikolay Matvienko on 4/15/18.
 */
"use strict";

const http = require('http');
const SubsetSum = require('./subsetSumFork');
//const SubsetSum = require('./subsetSum');

const server = http.createServer((req, res) => {
    const url = require('url').parse(req.url, true);
    if (url.pathname === '/subsetSum') {
        //const data = JSON.parse(url.query.data);
        const data = [116, 119, 101, -116, 109, 101, -105, -102, 117, -115, -97, 119, -116, -104, -105, 115];
        const sum = 0;
        res.writeHead(200);
        //url.query.sum
        const subsetSum = new SubsetSum(sum, data);
        subsetSum.on('match', match => {
            res.write(`Match: ${JSON.stringify(match)}\n`);
        });

        subsetSum.on('end', () => res.end());
        subsetSum.start();

    } else {
        res.writeHead(200);
        res.end('I\m alive!\n');
    }
}).listen(8000, () => console.log('Started'));

// Graceful shutdown
process.on('SIGTERM', () => {
    process.workers.forEach(worker => {
        worker.kill();
    });

    server.close((err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }

        process.exit(0)
    })
});
