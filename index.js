/**
 * Created by Nikolay Matvienko on 4/26/18.
 */
'use strict';

process.env.UV_THREADPOOL_SIZE = 2;

const argv = require('minimist')(process.argv.slice(2));
const serverFactory = require('./lib/serverFactory');
const { case1, case2, case3, case4,
        case5, case6, case7, case8, case9, case10,
        express, fastify } = serverFactory;

switch (argv.c) {
    case 1:
        require('newrelic');
        case1();
        break;

    case 2:
        require('newrelic');
        case2();
        break;

    case 3:
        case3();
        break;

    case 4:
        case4();
        break;

    case 5:
        require('newrelic');
        case5();
        break;

    case 6:
        require('newrelic');
        case6();
        break;

    case 7:
        case7();
        break;

    case 8:
        case8();
        break;

    case 9:
        case9();
        break;

    case 10:
        case10();
        break;

    case 100:
        express();
        break;

    case 101:
        fastify();
        break;

    default:
        console.warn( 'Incorrect scenario please use npm scripts.' );
        case3();
}
