import React from 'react';
import ReactDOM from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import controllerFactory from '../../lib/controllers/controllerFactory';
import PageStart from './partials/_start.html';
import PageEnd from './partials/_end.html';
import App from '../shared/App';

const CpuTask = require('../../lib/tasks/CpuTask');
const ParallelCpuTask = require('../../lib/tasks/ParallelCpuTask');
//Configuration
const config = require('../../config');
const { routes, port, cpuData, logData } = config;


const pinoLogger = require('pino')();


const controller = controllerFactory(pinoLogger, ParallelCpuTask);


const getPageStart = (styles) => PageStart.replace(
    '%styles%',
    styles.map(file => `<link rel="preload" href="${file}" as="style" media="screen" onload="this.rel='stylesheet'"/>`)
);

const getPageEnd = (cssHash, js) => PageEnd.replace('%cssHash%', cssHash).replace('%js%', js);

/**\
 * Provides the server side rendered app. In development environment, this method is called by
 * `react-hot-server-middleware`.
 *
 * @param clientStats Parameter passed by hot server middleware
 */

export default ({ clientStats }) => async (req, res, next) => {
    const data = "TEST";
    // req.metaData = { method: req.method, url: req.url, headers: req.headers };
    // req.data = cpuData;
    //return controller.holy(req, res).then(data => {});

    req.data = logData;
    return controller.api(req, res).then(data => {
        
        res.send(ReactDOM.renderToString(<App list={data}/>));
        //
        // const stream = ReactDOM.renderToNodeStream(<App list={data}/>);
        // const chunkNames = flushChunkNames();
        // const { js, stylesheets, cssHash } = flushChunks(clientStats, { chunkNames });
        //
        // res.write(getPageStart(stylesheets));
        // res.write('<div id="react-root">');
        // stream.pipe(res, { end: false });
        // stream.on('end', () => {
        //     res.write('</div>');
        //     res.end(getPageEnd(cssHash, js));
        // });
    });
};
