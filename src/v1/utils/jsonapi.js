const JSONAPISerializer = require('json-api-serializer');

const jsonapiObject = {
  version: '1.0' // http://jsonapi.org/format/1.0
};

const serializer = new JSONAPISerializer({
  convertCase: 'kebab-case',
  unconvertCase: 'camelCase'
});

module.exports = {
  jsonapiObject,
  serializer
};
