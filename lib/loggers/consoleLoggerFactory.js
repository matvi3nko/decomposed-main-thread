/**
 * Created by Nikolay Matvienko on 4/28/18.
 */
'use strict';

const ConsoleLogger = require('../fakes/ConsoleLogger');

module.exports = function factory () {
    return new ConsoleLogger();
};
