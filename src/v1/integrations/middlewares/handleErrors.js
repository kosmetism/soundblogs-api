const { errors } = require('fortune');
const chalk = require('chalk');
const { env } = require('c0nfig');

const jsonApiMeta = require('../../utils/jsonApiMeta');

// const verboseEnvs = ['development', 'test'];
const verboseEnvs = ['development'];

const errorsMap = {
  UnprocessableError: 422,
  UnsupportedError: 415,
  ConflictError: 409,
  NotAcceptableError: 406,
  MethodError: 405,
  NotFoundError: 404,
  ForbiddenError: 403,
  UnauthorizedError: 401,
  BadRequestError: 400
};

function getStatus (err) {
  const fortuneError = errors[err.name];

  if (fortuneError && (err instanceof fortuneError)) {
    return errorsMap[err.name];
  }

  return 500;
}

module.exports = function handleErrors (err, req, res, next) {
  if (verboseEnvs.includes(env)) {
    console.log(chalk.red(err));
  }

  const status = getStatus(err);
  const response = {
    jsonapi: {
      ...jsonApiMeta
    },
    errors: [{
      title: err.name,
      details: err.message
    }]
  };

  res.status(status).json(response);
};
