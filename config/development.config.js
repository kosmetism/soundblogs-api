module.exports = {
  port: process.env.NODE_PORT || process.env.PORT || 1979,

  staticFilesUrl: '',

  auth: {
    tokenTTL: 1000 * 60 * 60 * 24 * 30 * 1, // 1 month
    resetPasswordTTL: 1000 * 60 * 60 * 24, // 1 day
    bcryptHashRounds: 10
  },

  s3: {

  },

  mongodb: {
    url: process.env.MONGODB_URL
  }
};
