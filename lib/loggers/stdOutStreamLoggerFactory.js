/**
 * Created by Nikolay Matvienko on 4/28/18.
 */
'use strict';

const StdOutStreamLogger = require('../adapters/StdOutStreamLogger');

module.exports = function factory () {
    return new StdOutStreamLogger();
};
