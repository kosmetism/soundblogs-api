const express = require('express');
const fortuneHTTP = require('fortune-http');
const jsonApiSerializer = require('fortune-json-api');
const chalk = require('chalk');
const { env } = require('c0nfig');

const jsonApiMeta = require('../utils/jsonApiMeta');

const formDataSerializer = fortuneHTTP.FormDataSerializer;

// const verboseEnvs = ['development', 'test'];
const verboseEnvs = ['development'];

module.exports = function resources (store) {
  const router = express.Router();
  const fortuneHTTPListener = fortuneHTTP(store, {
    serializers: [
      [jsonApiSerializer, {
        jsonapi: { ...jsonApiMeta }
      }],
      [formDataSerializer]
    ]
  });

  router.use((req, res) => {
    return fortuneHTTPListener(req, res).catch((err) => {
      if (verboseEnvs.includes(env)) {
        console.log(chalk.red(err.stack));
      }
    });
  });

  return router;
};
