module.exports = {
  port: process.env.NODE_PORT || process.env.PORT || 1901,

  staticFilesUrl: 'http://cdn.for.tests.org',

  auth: {
    tokenTTL: 1000 * 60 * 60 * 24 * 30 * 1, // 1 month
    resetPasswordTTL: 1000 * 60 * 60 * 24, // 1 day
    bcryptHashRounds: 2
  },

  s3: {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET
  },

  mongodb: {
    url: 'mongodb://localhost:27017/soundblogs-test-db'
  }
};
