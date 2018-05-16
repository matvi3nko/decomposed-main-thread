/**
 * Created by Nikolay Matvienko on 4/28/18.
 */
'use strict';

const pino = require('pino');
const childProcess = require('child_process');
const stream = require('stream');

module.exports = function () {
    return pino();
};

module.exports.createWithFileTransport = function () {
// Environment variables
    const cwd = process.cwd();
    const {env} = process;
    const logPath = `./temp`;

// Create a stream where the logs will be written
    const logThrough = new stream.PassThrough();
    const log = pino({name: 'project'}, logThrough);

// Log to multiple files using a separate process
    const child = childProcess.spawn(process.execPath, [
        require.resolve('pino-tee'),
        'info', `${logPath}/pino.log`,
        'warn', `${logPath}/warn.log`,
        'error', `${logPath}/error.log`,
        'fatal', `${logPath}/fatal.log`
    ], {cwd, env});


    logThrough.pipe(child.stdin);

    return log;
};

