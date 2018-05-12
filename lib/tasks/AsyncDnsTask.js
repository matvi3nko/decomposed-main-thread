'use strict';

const dns = require('dns');

class AsyncDnsTask {
    constructor (url) {
        this._url = url;
    }

    start () {
        const options = {
            family: 6//,
           // hints: dns.ADDRCONFIG | dns.V4MAPPED,
        };

        return new Promise((resolve, reject) => {
            dns.lookup(this._url, options, (err, address, family) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(`${this._url} address: ${address} family: IPv ${family}`);
            })
        });
    }
}

module.exports = AsyncDnsTask;