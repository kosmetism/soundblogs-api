const fortune = require('fortune');

const methodsMap = {
  GET: fortune.methods.find,
  POST: fortune.methods.create,
  PATCH: fortune.methods.update,
  DELETE: fortune.methods.delete
};

module.exports = methodsMap;
