const fortune = require('fortune');
const customDefinitions = require('../customDefinitions');

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;
const deleteMethod = fortune.methods.delete;

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const tokenDataType = {
  name: 'token',

  collection: 'tokens',

  definition: {
    userId: String,
    expireAt: Date
  },

  index: {
    keys: {
      expireAt: 1
    },
    options: {
      expireAfterSeconds: 0
    }
  },

  async input(context, record, update) {
    const method = context.request.method;

    if (method === createMethod) {
      return record;
    }

    if (method === updateMethod) {
      return update;
    }

    if (method === deleteMethod) {
    }

    return null;
  },

  async output(context, record) {
    const method = context.request.method;

    if (method === findMethod) {
    }

    return record;
  }
};

module.exports = tokenDataType;
