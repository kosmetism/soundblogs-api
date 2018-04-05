const express = require('express');

const resources = require('./resources');
const integrations = require('./integrations');

module.exports = function v1 () {
  const router = express.Router();

  router.use('/resources', resources());
  router.use('/integrations', integrations());

  return router;
};
