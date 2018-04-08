const fortune = require('fortune');
const config = require('c0nfig');

const schemas = require('../../resources/schemas');
const authUtil = require('../../utils/auth');
const passwordsUtil = require('../../utils/passwords');
const validateSchema = require('../../utils/validateSchema');
const customDefinitions = require('../customDefinitions');

const { GET, POST, PATCH, DELETE } = require('../methodsMap');

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const tokenDataType = {
  name: 'token',

  collection: 'tokens',

  definition: {
    email: customDefinitions.Email,
    password: String,

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

  async input(context, record) {
    const method = context.request.method;

    if (method === POST) {
      validateSchema(record, schemas.token.create);

      const users = await context.transaction.find('user', null, {
        match: {
          email: record.email
        },
        fields: {
          name: true,
          email: true,
          password: true,
          pictureUrl: true
        }
      });

      if (!users.count) {
        throw new BadRequestError('Email or password are not correct');
      }

      const [ user ] = users;
      const same = await passwordsUtil.compare(record.password.toString(), user.password);

      if (!same) {
        throw new BadRequestError('Email or password are not correct');
      }

      delete record.email;
      delete record.password;

      record.userId = user.id;
      record.expireAt = new Date(Date.now() + config.auth.tokenTTL);

      return record;
    }

    if (method === PATCH) {
      throw new ForbiddenError('Tokens cannot be updated');
    }

    if (method === DELETE) {
      const user = await authUtil.validateToken(context);

      if (record.userId !== user.id) {
        throw new ForbiddenError('Token is not valid for this user');
      }
    }

    return null;
  },

  async output(context, record) {
    const method = context.request.method;

    if (method === GET) {
      throw new ForbiddenError('Tokens access is not allowed');
    }

    delete record.email;
    delete record.password;

    record.accessedAt = new Date();

    return record;
  }
};

module.exports = tokenDataType;
