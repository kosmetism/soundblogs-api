const isEmail = require('validator/lib/isEmail');
const isBase64 = require('validator/lib/isBase64');

function inheritToFrom (Type, Instance) {
  Type.prototype = new Instance();
}

const Email = value => {
  return isEmail(value.trim());
};
inheritToFrom(Email, String);

const Enum = (values = []) => {
  if (!Array.isArray(values)) {
    values = values.split('|');
  }

  function _Enum(value) {
    return values.indexOf(value.trim()) > -1;
  }
  inheritToFrom(_Enum, String);

  return _Enum;
};

const Base64 = value => {
  return isBase64(value.trim());
};
inheritToFrom(Base64, String);

const dataURIRegex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
const DataURI = (value) => {
  return dataURIRegex.test(value.trim());
};
inheritToFrom(DataURI, String);

module.exports = {
  Email,
  Enum,
  Base64,
  DataURI
};
