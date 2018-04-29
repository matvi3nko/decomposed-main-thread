'use strict';

const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');

const esTransportOpts = {
    level: 'info'
};

module.exports = function () {
    return new winston.createLogger({
        transports: [
            new Elasticsearch(esTransportOpts)
        ]
    });
};
