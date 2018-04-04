const express = require('express');
const fortuneHTTP = require('fortune-http');
const jsonApiSerializer = require('fortune-json-api');
const chalk = require('chalk');
const { env } = require('c0nfig');

const store = require('./store');

const formDataSerializer = fortuneHTTP.FormDataSerializer;

const httpListener = fortuneHTTP(store, {
  serializers: [
    [jsonApiSerializer],
    [formDataSerializer]
  ]
});

// const verboseEnvs = ['development', 'test'];
const verboseEnvs = ['development'];

function apiMiddleware (req, res) {
  return httpListener(req, res).catch((err) => {
    if (verboseEnvs.includes(env)) {
      console.log(chalk.red(err.stack));
    }
  });
}

module.exports = function v1 () {
  const router = express.Router();

  router.use(apiMiddleware);

  return router;
};
