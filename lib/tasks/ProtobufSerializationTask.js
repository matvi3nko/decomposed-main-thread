'use strict';
const protobuf = require('protocol-buffers');
const fs = require('fs');

class ProtobufSerializationTask {
    constructor (set) {
        this._set = set;
        // this._schema = protobuf(fs.readFileSync('./lib/schemas/OrdersWithStrings.proto'));
        this._schema = protobuf(fs.readFileSync('./lib/schemas/OrdersWithNumbers.proto'));
    }

    encode () {
        return new Promise((resolve, reject) => {
            resolve(this._schema.Payload.encode(this._set));
        });
    }

    dencode () {
        return new Promise((resolve, reject) => {
            const result = this._schema.Payload.decode(this._set);
            resolve(result.list.length.toString());
        });
    }
}

module.exports = ProtobufSerializationTask;