const express = require('express');

const spotify = require('./spotify');
const handleErrors = require('./middlewares/handleErrors');

module.exports = function integrations (store) {
  const router = express.Router();

  router.use('/spotify', spotify(store));
  router.use(handleErrors);

  return router;
};
