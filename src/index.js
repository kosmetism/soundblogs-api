const http = require('http');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const compression = require('compression');
const { port, env, mongodb } = require('c0nfig');
const v1 = require('./v1');

const app = express();

if ('test' !== env) {
  app.use(logger('dev'));
}

app.disable('x-powered-by');
app.use(cors());
app.use(compression());
app.use('/v1', v1());

function start () {
  http.createServer(app).listen(port, () => {
    console.log(`api server is listening on http://localhost:${port} env=${env} db=${mongodb.url}`);
  });
}

module.exports = {
  app,
  start
};
