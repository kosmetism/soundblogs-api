module.exports = {
  port: process.env.NODE_PORT || process.env.PORT || 1979,

  staticFilesUrl: 'https://cdn.soundblogs.xyz',

  auth: {
    tokenTTL: 1000 * 60 * 60 * 24 * 30 * 1, // 1 month
    resetPasswordTTL: 1000 * 60 * 60 * 24, // 1 day
    bcryptHashRounds: 10
  },

  s3: {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET
  },

  mongodb: {
    url: process.env.MONGODB_URL
  },

  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  }
};
