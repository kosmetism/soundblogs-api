const url = require('url');

const authUtil = require('../../utils/auth');

module.exports = function validateToken (store) {
  return async (req, res, next) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const request = {
      meta: {
        headers: req.headers
      },
      uriObject: {
        ...url.parse(fullUrl),
        query: req.query
      }
    };

    try {
      const context = store.__createCustomContext(request);
      req.user = await authUtil.validateToken(context);

      next();
    } catch (err) {
      next(err);
    }
  };
};
