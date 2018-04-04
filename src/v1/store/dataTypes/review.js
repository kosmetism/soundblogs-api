const fortune = require('fortune');
const speakingurl = require('speakingurl');

const schemas = require('../../schemas');
const authUtil = require('../../utils/auth');

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;
const deleteMethod = fortune.methods.delete;

const reviewDataType = {
  name: 'review',

  collection: 'reviews',

  definition: {
    // release data provided by 3rd-party api
    artist: String,
    title: String,
    coverUrl: String,
    releasedAt: Date,

    // review data editable by user
    slug: String,
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
    const user = await authUtil.validateToken(context);

    if (method === createMethod) {
      schemas.validate(record, schemas.review.create);

      record.author = user.id;
      record.draft = true;

      if (record.title && !record.slug) {
        record.slug = speakingurl(record.title);
      }

      const now = new Date();

      record.createdAt = now;
      record.updatedAt = now;

      return record;
    }

    if (method === updateMethod) {
      schemas.validate(update.replace, schemas.review.update);

      update.replace.updatedAt = new Date();

      if (update.replace.title && !update.replace.slug) {
        update.replace.slug = speakingurl(update.replace.title);
      }

      if (!update.replace.draft) {
        update.replace.publishedAt = new Date();
      }

      return update;
    }

    if (method === deleteMethod) {
    }

    return null;
  },

  async output(context, record) {
    if (record.draft) {
      delete record.publishedAt;
    }

    record.accessedAt = new Date();

    return record;
  }
};

module.exports = reviewDataType;
