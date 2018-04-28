const crypto = require('crypto');

class AsyncCryptoTask {
    constructor (data = 'secret') {
        this._data = data;
    }

    start () {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(this._data, 'salt', 100, 64, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });
    }
}

module.exports = AsyncCryptoTask;

