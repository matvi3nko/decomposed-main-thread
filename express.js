'use strict';

const nr = require('newrelic');
const express = require('express');
const app = express();
const CpuTask = require('./processPool/cpuTask');

//Logger
const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const { routes, port, data, sum } = require('./config');

const esTransportOpts = {
    level: 'info'
};
const logger = new winston.createLogger({
    transports: [
        new Elasticsearch(esTransportOpts)
    ]
});

routes.forEach(route => {
    app.get(`/${route}`, function (req, res) {
        res.send({greeting: 'Hello HolyJS!'});
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
