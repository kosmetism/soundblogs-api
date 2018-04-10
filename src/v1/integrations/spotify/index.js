const express = require('express');
const fortune = require('fortune');

const jsonapiUtil = require('../../utils/jsonapi');
const spotifyWebApi = require('../../utils/spotifyWebApi');
const validateToken = require('../../middlewares/validateToken');

const BadRequestError = fortune.errors.BadRequestError;

jsonapiUtil.serializer.register('spotify', {});

module.exports = function spotify (store) {
  const router = express.Router();

  router.get('/authorize-url',
    validateToken(store),
    getSpotifyAuthorizeUrl);

  router.get('/access-token',
    validateToken(store),
    getSpotifyAccessToken);

  router.get('/refresh-token',
    validateToken(store),
    refreshAccessToken);

  router.get('/search',
    validateToken(store),
    checkSpotifyAccessToken,
    searchSpotifyAlbums);

  router.get('/album/:id',
    validateToken(store),
    checkSpotifyAccessToken,
    getSpotifyAlbum)

  function checkSpotifyAccessToken (req, res, next) {
    const spotifyAccessToken = req.query.spotify_access_token;

    if (!spotifyAccessToken) {
      return next(new BadRequestError('Spotify Web API token is missing'))
    }

    req.spotifyAccessToken = spotifyAccessToken;

    next();
  }

  function getSpotifyAuthorizeUrl (req, res) {
    const scopes = [] // https://developer.spotify.com/web-api/using-scopes
    const authorizeUrl = spotifyWebApi().createAuthorizeURL(scopes);
    const jsonapiData = jsonapiUtil.serializer.serialize('spotify', { authorizeUrl });

    res.json(jsonapiData);
  }

  async function getSpotifyAccessToken (req, res, next) {
    const code = req.query.code;

    if (!code) {
      return next(new BadRequestError('Spotify authorization code is missing'));
    }

    try {
      const spotifyResponse = await spotifyWebApi().authorizationCodeGrant(code);
      const jsonapiData = jsonapiUtil.serializer.serialize('spotify', spotifyResponse.body);

      return res.json(jsonapiData);
    } catch (err) {
      next(new BadRequestError('Spotify Web API error'));
    }
  }

  async function refreshAccessToken (req, res, next) {
    const refreshToken = req.query.spotify_refresh_token;

    if (!refreshToken) {
      return next(new BadRequestError('Spotify refresh token is missing'));
    }

    try {
      const spotifyResponse = await spotifyWebApi(null, refreshToken).refreshAccessToken();
      const jsonapiData = jsonapiUtil.serializer.serialize('spotify', spotifyResponse.body);

      return res.json(jsonapiData);

    } catch (err) {
      console.log(err);
      next(new BadRequestError('Spotify Web API error'));
    }
  }

  async function searchSpotifyAlbums (req, res, next) {
    try {
      const spotifyResponse = await spotifyWebApi(req.spotifyAccessToken).searchAlbums(req.query.q);
      const jsonapiData = jsonapiUtil.serializer.serialize('spotify', spotifyResponse.body);

      res.json(jsonapiData);
    } catch (err) {
      next(new BadRequestError('Spotify Web API error'));
    }
  }

  async function getSpotifyAlbum (req, res, next) {
    try {
      const spotifyResponse = await spotifyWebApi(req.spotifyAccessToken).getAlbum(req.params.id);
      const jsonapiData = jsonapiUtil.serializer.serialize('spotify', spotifyResponse.body);

      res.json(jsonapiData);
    } catch (err) {
      next(new BadRequestError('Spotify Web API error'));
    }
  }

  return router;
};
