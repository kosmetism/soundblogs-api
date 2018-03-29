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
    // release data provided by 3rd-party api
    artist: String,
    title: String,
    coverUrl: String,
    releasedAt: Date,

    // revuew data editable by user
    intro: String,
    content: String,
    rating: Number,
    favoriteTrack: String,
    genres: Array(String),
    draft: Boolean,

    // review meta data
    createdAt: Date,
    updatedAt: Date,
    publishedAt: Date,
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
