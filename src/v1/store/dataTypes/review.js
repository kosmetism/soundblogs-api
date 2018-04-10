const speakingurl = require('speakingurl');

const schemas = require('../../resources/schemas');
const authUtil = require('../../utils/auth');
const validateSchema = require('../../utils/validateSchema');

const { GET, POST, PATCH, DELETE } = require('../methodsMap');

const reviewDataType = {
  name: 'review',

  collection: 'reviews',

  definition: {
    // release data provided by 3rd-party api
    artist: String,
    title: String,
    coverUrls: Array(String),
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

  async beforeRequest(store, request) {
    const method = request.method;
    const headers = request.meta.headers;
    const query = request.uriObject.query || {};

    if (method === GET) {
      if (headers.authorization || query.token) {
        // mimic context object
        const context = store.__createCustomContext(request);

        await authUtil.validateToken(context);
      } else {
        if (!request.options.match) {
          request.options.match = {};
        }

        request.options.match.draft = false;
      }
    }
  },

  async input(context, record, update) {
    const method = context.request.method;
    const user = await authUtil.validateToken(context);

    if (method === POST) {
      validateSchema(record, schemas.review.create);

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

    if (method === PATCH) {
      validateSchema(update.replace, schemas.review.update);

      update.replace.updatedAt = new Date();

      if (update.replace.title && !update.replace.slug) {
        update.replace.slug = speakingurl(update.replace.title);
      }

      if (!update.replace.draft) {
        update.replace.publishedAt = new Date();
      }

      return update;
    }

    if (method === DELETE) {
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
