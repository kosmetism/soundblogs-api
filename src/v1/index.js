const express = require('express');

const store = require('./store');
const resources = require('./resources');
const integrations = require('./integrations');

module.exports = function v1 () {
  const router = express.Router();

  router.use('/resources', resources(store));
  router.use('/integrations', integrations(store));

  return router;
};
