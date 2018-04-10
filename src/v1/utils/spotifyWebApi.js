const SpotifyWebApi = require('spotify-web-api-node');
const config = require('c0nfig');

module.exports = function createSpotifyWebApi (accessToken, refreshToken) {
  const spotifyWebApi = new SpotifyWebApi({
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret,
    redirectUri: config.spotify.redirectUri
  });

  if (accessToken) {
    spotifyWebApi.setAccessToken(accessToken);
  }

  if (refreshToken) {
    spotifyWebApi.setRefreshToken(refreshToken);
  }

  return spotifyWebApi;
};
