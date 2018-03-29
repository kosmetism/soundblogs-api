const fortune = require('fortune');
const validateSchema = require('is-my-schema-valid').default;

const BadRequestError = fortune.errors.BadRequestError;
const dataURIRegex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

const defaults = {
  filter: true,
  formats: {
    'data-uri': dataURIRegex
  }
};

module.exports = function validate (record, schema, options) {
  const result = validateSchema(record, schema, { ...defaults, ...options });

  if (!result.valid) {
    const badRequestError = new BadRequestError('Error validating against schema');

    badRequestError.schema = result.errors;

    throw badRequestError;
  }
};
