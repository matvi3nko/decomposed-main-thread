'use strict';

const nr = require('newrelic');
const express = require('express');
const app = express();

module.exports = function createServer (config, logger, CpuTask) {
    const { routes, port, data, sum } = config;

    routes.forEach(route => {
        app.get(`/${route}`, function (req, res) {
            res.send({ greeting: 'Hello HolyJS!' });
        });
    });

    app.get('/cpu', function (req, res) {
        const subsetSum = new CpuTask(sum, data);

        return subsetSum.start()
            .then(result => {
                const meta = {
                    method: req.method,
                    url: req.url,
                    headers: req.headers
                };

                logger.info(meta, 'Winston log');

                return res.send(result);
            })
            .catch(error => {
                console.error(error);
                res.send(error);
            });
    });

    app.listen(port, function () {
        console.log(`Server process: ${process.pid}`);
        console.log(`Express server listening on port ${port}!`);
    });

    return app;
};
