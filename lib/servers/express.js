'use strict';

const express = require('express');
const app = express();

let counter = 0;

module.exports = function createServer (config, logger, CpuTask, AsyncTasksQueue) {
    const { routes, port, data, bigData, sum } = config;

    routes.forEach(route => {
        app.get(`/${route}`, function (req, res) {
            res.send({ greeting: 'Hello HolyJS!' });
        });
    });

    app.get('/cpu', function (req, res) {
        const cpuTask = new CpuTask(sum, [...data, counter++]);

        return cpuTask.start()
            .then(result => {
                const meta = { method: req.method, url: req.url, headers: req.headers };

                logger.info(meta, 'log message');

                return res.send(result);
            })
            .catch(error => {
                console.error(error);
                res.send(error);
            });
    });

    app.get('/async', function (req, res) {
        const asyncTasksQueue = new AsyncTasksQueue(req.query.crypto, req.query.fs, [...data, counter++]);

        return asyncTasksQueue.start()
            .then(result => {
                return res.send(result);
            })
            .catch(error => {
                console.error(error);
                res.send(error);
            });
    });

    app.get('/log', function (req, res) {
        const count = req.query.count || 1;

        const meta = { method: req.method, url: req.url, headers: req.headers };
        for (let i = 0; i < count; i++) {
            logger.info(meta, 'log message');
        }

        res.send('Logged');
    });

    app.get('/biglog', function (req, res) {
        const count = req.query.count || 1;

        for (let i = 0; i < count; i++) {
            logger.info(bigData, 'big log message');
        }

        res.send('Logged');
    });

    app.listen(port, function () {
        console.log(`Server process: ${process.pid}`);
        console.log(`Express server listening on port ${port}!`);
    });

    return app;
};
