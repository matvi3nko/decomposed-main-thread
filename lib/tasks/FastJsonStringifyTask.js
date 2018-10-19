'use strict';
const fastJson = require('fast-json-stringify');
const jitson = require('jitson');
const schemaWithStrings = require('../schemas/OrdersWithStrings.json');
const schemaWithNumbers = require('../schemas/OrdersWithNubmers.json');

// make an instance
const parse = jitson();

const stringify = fastJson(schemaWithStrings);

class FastJsonStringifyTask {
    constructor(set) {
        this._set = set;
    }

    encode () {
        return new Promise((resolve, reject) => {
            resolve(stringify(this._set));
        });
    }

    decode () {
        return new Promise((resolve, reject) => {
            const result = parse(this._set);
            resolve(result.list.length.toString());
        });
    }
}

module.exports = FastJsonStringifyTask;
