const fortune = require('fortune');
const config = require('c0nfig');
const store = require('../store');

const BadRequestError = fortune.errors.BadRequestError;
const UnauthorizedError = fortune.errors.UnauthorizedError;

async function validateToken (request, skipUserData) {
  const headers = request.meta.headers;
  const query = request.uriObject.query || {};
  const tokenId = headers.authorization || query.token;

  if (!tokenId) {
    throw new BadRequestError('Token is missing');
  }

  const tokens = await store.adapter.find('token', [tokenId], {
    fields: {
      userId: true
    }
  });

  if (!tokens.count) {
    throw new UnauthorizedError('Token is expired or incorrect');
  }

  const [ token ] = tokens;

  if (skipUserData) {
    return token;
  }

  const users = await store.adapter.find('user', [token.userId], {
    fields: {
      email: true,
      roles: true
    }
  });

  if (!users.count) {
    throw new UnauthorizedError('There are no user with this token');
  }

  const [ user ] = users;

  return user;
}

module.exports = {
  validateToken
};
