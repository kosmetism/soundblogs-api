const fortune = require('fortune');
const customDefinitions = require('../customDefinitions');

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;
const deleteMethod = fortune.methods.delete;

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const userDataType = {
  name: 'user',

  collection: 'users',

  definition: {
    name: String,
    email: customDefinitions.Email,
    password: String,
    pictureUrl: String,
    reviews: [Array('review'), 'author']
  },

  index: {
    keys: {
      email: 1
    },
    options: {
      unique: true
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

module.exports = userDataType;
