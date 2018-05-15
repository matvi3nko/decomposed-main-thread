'use strict';

process.on('message', data => {
    process.send({ data });
});