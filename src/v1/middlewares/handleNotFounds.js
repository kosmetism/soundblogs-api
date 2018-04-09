const fortune = require('fortune');

const NotFoundError = fortune.errors.NotFoundError;

module.exports = function handleNotFounds (req, res, next) {
  next(new NotFoundError('Endpoint does not exist'));
};
