'use strict';

/**
 * @class {StdOutStreamLogger} logger adapter
 */
class StdOutStreamLogger {
    /**
     * wrapper above log `error` method
     * @param args
     * @returns {*}
     */
    error (...args) {
        return process.stderr.write(...args);
    }

    /**
     * wrapper above log `warn` method
     * @param args
     * @returns {*}
     */
    warn (...args) {
        return process.stderr.write(...args);
    }

    /**
     * wrapper above log `info` method
     * @param args
     * @returns {*}
     */
    info (...args) {
        return process.stdout.write(...args);
    }

    /**
     * wrapper above log `verbose` method
     * @param args
     * @returns {*}
     */
    verbose (...args) {
        return process.stdout.write(...args);
    }

    /**
     * wrapper above log `silly` method
     * @param args
     * @returns {*}
     */
    silly (...args) {
        return process.stdout.write(...args);
    }

    /**
     * wrapper above log `debug` method
     * @param args
     * @returns {*}
     */
    debug (...args) {
        return process.stdout.write(...args);
    }
}

module.exports = StdOutStreamLogger;
