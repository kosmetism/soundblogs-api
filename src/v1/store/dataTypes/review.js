const fortune = require('fortune');

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;
const deleteMethod = fortune.methods.delete;

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const reviewDataType = {
  name: 'review',

  collection: 'reviews',

  definition: {
    artist: String,
    title: String,
    releasedAt: Date,

    intro: String,
    content: String,
    coverUrl: String,
    rating: String,
    favoriteTrack: String,
    genres: Array(String),

    createdAt: Date,
    updatedAt: Date,
    publishedAt: Date,
    draft: Boolean,
    author: ['user', 'reviews']
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

module.exports = reviewDataType;
