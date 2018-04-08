const express = require('express');
const fortune = require('fortune');
const config = require('c0nfig');
const SpotifyWebApi = require('spotify-web-api-node');

const validateToken = require('../middlewares/validateToken');

const BadRequestError = fortune.errors.BadRequestError;

module.exports = function spotify (store) {
  const router = express.Router();
  const spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret,
    redirectUri: config.spotify.redirectUri
  });

  router.get('/authorize-url',
    validateToken(store),
    (req, res) => {
      const authorizeUrl = spotifyApi.createAuthorizeURL(['user-read-email']);

      res.json({ authorizeUrl });
    });

  router.get('/access-token',
    validateToken(store),
    async (req, res, next) => {
      try {
        const spotifyResponse = await spotifyApi.authorizationCodeGrant(req.query.code);

        res.json(spotifyResponse.body);
      } catch (err) {
        next(new BadRequestError('Spotify Web API error'));
      }
    }
  );

  router.get('/search',
    validateToken(store),
    (req, res) => {
      res.send('query spotify api here');
    });

  return router;
};
