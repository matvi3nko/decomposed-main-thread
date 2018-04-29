'use strict';

/**
 * @class {ConsoleLogger} logger adapter
 */
class ConsoleLogger {
    /**
     * wrapper above log `error` method
     * @param args
     * @returns {*}
     */
    error (...args) {
        return console.error(...args);
    }

    /**
     * wrapper above log `warn` method
     * @param args
     * @returns {*}
     */
    warn (...args) {
        return console.warn(...args);
    }

    /**
     * wrapper above log `info` method
     * @param args
     * @returns {*}
     */
    info (...args) {
        return console.log(...args);
    }

    /**
     * wrapper above log `verbose` method
     * @param args
     * @returns {*}
     */
    verbose (...args) {
        return console.log(...args);
    }

    /**
     * wrapper above log `silly` method
     * @param args
     * @returns {*}
     */
    silly (...args) {
        return console.log(...args);
    }

    /**
     * wrapper above log `debug` method
     * @param args
     * @returns {*}
     */
    debug (...args) {
        return console.debug(...args);
    }
}

module.exports = ConsoleLogger;
