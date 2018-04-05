const express = require('express');
const fortuneHTTP = require('fortune-http');
const jsonApiSerializer = require('fortune-json-api');
const chalk = require('chalk');
const { env } = require('c0nfig');

const store = require('./store');

const formDataSerializer = fortuneHTTP.FormDataSerializer;

const fortuneHTTPListener = fortuneHTTP(store, {
  serializers: [
    [jsonApiSerializer],
    [formDataSerializer]
  ]
});

// const verboseEnvs = ['development', 'test'];
const verboseEnvs = ['development'];

function fortuneMiddleware (req, res) {
  return fortuneHTTPListener(req, res).catch((err) => {
    if (verboseEnvs.includes(env)) {
      console.log(chalk.red(err.stack));
    }
  });
}

module.exports = function resources () {
  const router = express.Router();

  router.use(fortuneMiddleware);

  return router;
};
