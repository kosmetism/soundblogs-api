const test = require('ava');
const _ = require('lodash');
const config = require('c0nfig');

const {
  createTestUserData,
  createTestReviewData,
  createJsonApiRecord,
  createJsonApiRequest
} = require('../testUtils');

let request;
let userData;
let reviewData;
let userId;
let tokenId;
let reviewId;

test.before('create request instance', () => {
  request = createJsonApiRequest();
});

test.before('create test user data', () => {
  userData = createTestUserData();
});

test.before('POST /users (register user)', async t => {
  const res = await request
    .post('/v1/resources/users')
    .send(createJsonApiRecord('user', userData));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  userId = res.body.data.id;
});

test.before('POST /tokens (login user)', async t => {
  const res = await request
    .post('/v1/resources/tokens')
    .send(createJsonApiRecord('token', {
      email: userData.email,
      password: userData.password
    }));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  tokenId = res.body.data.id;
});

test.before('create test review data', () => {
  reviewData = createTestReviewData();
});

test.before('POST /reviews (create review)', async t => {
  const res = await request
    .post('/v1/resources/reviews')
    .set('Authorization', tokenId)
    .send(createJsonApiRecord('review', reviewData));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes.draft);
  t.is(res.body.data.attributes.intro, reviewData.intro);
  t.is(res.body.data.attributes.content, reviewData.content);
  t.deepEqual(res.body.data.attributes.genres, reviewData.genres);

  reviewId = res.body.data.id;
});

test('PATCH /reviews without token', async t => {
  const res = await request
    .patch(`/v1/resources/reviews/${reviewId}`)
    .send(createJsonApiRecord('review', reviewId, reviewData));

  t.is(res.status, 400,
    'should respond with 400 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is missing',
    'should respond with correct error message');
});

test('PATCH /reviews with invalid token', async t => {
  const res = await request
    .patch(`/v1/resources/reviews/${reviewId}`)
    .set('Authorization', 'Invalid token id')
    .send(createJsonApiRecord('review', reviewId, reviewData));

  t.is(res.status, 401,
    'should respond with 401 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is expired or incorrect',
    'should respond with correct error message');
});

test('PATCH /reviews with valid token', async t => {
  const newData = {
    intro: 'New test intro!',
    draft: false
  };
  const res = await request
    .patch(`/v1/resources/reviews/${reviewId}`)
    .set('Authorization', tokenId)
    .send(createJsonApiRecord('review', reviewId, newData));

  t.is(res.status, 200,
    'should respond with 200 status');
  t.truthy(res.body.data,
    'should have data property');
  t.truthy(res.body.data.id,
    'should have id property');
  t.false(res.body.data.attributes.draft,
    'should have draft as "false" value');
  t.is(res.body.data.attributes.intro, newData.intro,
    'should have new intro value');
  t.is(res.body.data.attributes.content, reviewData.content,
    'should have content value');
  t.deepEqual(res.body.data.attributes.genres, reviewData.genres,
    'should have keywords value');
});
