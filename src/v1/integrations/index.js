const express = require('express');
const spotify = require('./spotify');

module.exports = function resources () {
  const router = express.Router();

  router.use('/spotify', spotify());

  return router;
};
