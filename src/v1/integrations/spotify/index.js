const express = require('express');
const config = require('c0nfig');
const SpotifyWebApi = require('spotify-web-api-node');

module.exports = function spotify () {
  const router = express.Router();
  // const spotifyApi = SpotifyWebApi({
  //   cliendId: config.spotify.cliendId,
  //   clientSecret: config.spotify.clientSecret,
  //   redirectUri: config.spotify.redirectUri
  // });

  router.get('/authorize', (req, res) => {
    res.send('authorization logic here');
  });

  router.get('/search', (req, res) => {
    res.send('query spotify api here');
  });

  return router;
};
