'use strict';

const winston = require('winston');
const fs = require('fs');
const path = require('path');
const Elasticsearch = require('winston-elasticsearch');

const options = {
    level: 'info'
};

module.exports.createWithEsTransport = function () {
    return new winston.createLogger({
        transports: [
            new Elasticsearch(options)
        ]
    });
};

module.exports.createWithFileTransport = function () {
    const filename = './temp/winston.log';

    try {
        fs.unlinkSync(filename);
    }
    catch (ex) {
    }

    return new winston.createLogger({
        transports: [
            new winston.transports.File({ filename, ...options })
        ]
    });
};

module.exports.createWithConsoleTransport = function () {
    return new winston.createLogger({
        transports: [
            new winston.transports.Console({
                handleExceptions: true
            })
        ],
        exitOnError: false
    });
};