const express = require('express');

module.exports = function spotify () {
  const router = express.Router();

  router.get('/search', (req, res) => {
    res.send('query spotify api here');
  });

  return router;
};
