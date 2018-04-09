const express = require('express');

const store = require('./store');
const resources = require('./resources');
const integrations = require('./integrations');
const handleErrors = require('./middlewares/handleErrors');
const handleNotFounds = require('./middlewares/handleNotFounds');

module.exports = function v1 () {
  const router = express.Router();

  router.use('/resources', resources(store));
  router.use('/integrations', integrations(store));
  router.use(handleNotFounds);
  router.use(handleErrors);

  return router;
};
