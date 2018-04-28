/**
 * Created by Nikolay Matvienko on 4/28/18.
 */
const FakeLogger = require('../fakes/FakeLogger');

module.exports = function factory () {
    return new FakeLogger();
};