const test = require('ava');
const _ = require('lodash');
const config = require('c0nfig');

const {
  createTestUserData,
  createJsonApiRecord,
  createJsonApiRequest
} = require('../testUtils');

let sendData;
let userData;
let request;

test.before('create request instance', () => {
  request = createJsonApiRequest();
});

test.beforeEach(() => {
  userData = createTestUserData();
  sendData = createJsonApiRecord('user', userData);
});

test('POST /users not matching schema', async t => {
  const notValid = createJsonApiRecord('user', {email: 'foo', password: 'qwert'});
  const res = await request
    .post('/v1/users')
    .send(notValid);

  console.log(res)

  t.is(res.status, 400,
    'should respond with 400 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Error validating against schema',
    'should respond with correct error message');
  t.is(res.body.errors[0].schema.length, 4,
    'should have all schema errors');
});

test('POST /users matching schema', async t => {
  const res = await request
    .post('/v1/users')
    .send(sendData);

  t.is(res.status, 201,
    'should respond with 201 status');
  t.truthy(res.body.data,
    'should have data property');
  t.truthy(res.body.data.id,
    'should have user id property');
  t.is(res.body.data.attributes.name, userData.name,
    'should have name value');
  t.is(res.body.data.attributes.email, userData.email,
    'should have email value');
  t.is(res.body.data.attributes['picture-url'], `${config.staticFilesUrl}/defaults/avatar`,
    'should have default picture-url');
  t.is(res.body.data.attributes.roles.join(','), userData.roles.join(','),
    'should have roles value');
});
