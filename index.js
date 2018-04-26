/**
 * Created by Nikolay Matvienko on 4/26/18.
 */
'use strict';

const argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
const { case1, case2, case3, case4, case5 } = require('./serverFactory');

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
        require('newrelic');
        case3();
        break;

    case 4:
        //require('newrelic');
        case4();
        break;
    case 5:
        require('newrelic');
        case5();
        break;
    default:
        console.warn( 'Incorrect scenario please use npm scripts.' );
        case1();
}
