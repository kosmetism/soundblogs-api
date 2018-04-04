const fortune = require('fortune');
const parseDataURI = require('parse-data-uri');
const config = require('c0nfig');

const schemas = require('../../schemas');
const authUtil = require('../../utils/auth');
const filesUtil = require('../../utils/files');
const passwordsUtil = require('../../utils/passwords');
const customDefinitions = require('../customDefinitions');

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;
const deleteMethod = fortune.methods.delete;

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const allowedMimetypes = ['image/png', 'image/jpeg', 'image/gif'];

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
      schemas.validate(record, schemas.user.create);

      const hash = await passwordsUtil.save(record.password);

      record.password = hash;

      return record;
    }

    if (method === updateMethod) {
      if (update.push || update.pull) {
        throw new ForbiddenError('Invalid update');
      }

      const user = await authUtil.validateToken(context);

      schemas.validate(update.replace, schemas.user.update);

      if (update.replace.pictureData) {
        const parsed = parseDataURI(update.replace.pictureData);

        if (!allowedMimetypes.includes(parsed.mimeType)) {
          throw new BadRequestError(`Picture data has unsupported mimetype - "${parsed.mimeType}"`);
        }

        const fileKey = `users/${user.id}/avatar`;

        update.replace.pictureUrl = await filesUtil.upload(parsed.data, parsed.mimeType, fileKey);
      }

      return update;
    }

    if (method === deleteMethod) {
      const user = await authUtil.validateToken(context);

      if (user.id !== record.id) {
        throw new ForbiddenError('Token is not valid for this user');
      }
    }

    return null;
  },

  async output(context, record) {
    const method = context.request.method;

    if (method === findMethod) {
      try {
        await authUtil.validateToken(context);
      } catch (e) {
        delete record.email;
      }
    }

    delete record.password;

    if (record.pictureUrl) {
      record.pictureUrl = `${config.staticFilesUrl}/${record.pictureUrl}`;
    } else {
      record.pictureUrl = `${config.staticFilesUrl}/defaults/avatar`;
    }

    record.accessedAt = new Date();

    return record;
  }
};

module.exports = userDataType;
