const express = require('express');
const spotify = require('./spotify');

module.exports = function integrations (store) {
  const router = express.Router();

  router.use('/spotify', spotify(store));

  return router;
};
