const uuidV4 = require('uuid/v4');
const supertest = require('supertest-as-promised');
const superagentDefaults = require('superagent-defaults');
const { app } = require('../src');

function createTestEmail() {
  return uuidV4() + '@tests.com';
}

function createTestUserData() {
  return {
    email: createTestEmail(),
    password: 'qwerty',
    name: 'John Doe'
  };
}

function createTestReviewData() {
  return {
    artist: 'Test review artist',
    title: 'Test review title',
    releasedAt: new Date('1979-01-02'),
    intro: 'Test review intro',
    content: 'Test review content',
    genres: ['post-disco', 'electronic']
  };
}

function createJsonApiRecord(type, id, attributes) {
  if (id && !attributes) {
    attributes = id;
    id = void 0;
  }

  const jsonData = { data: { type, attributes } };

  if (id) {
    jsonData.data.id = id;
  }

  return jsonData;
}

function createJsonApiRequest() {
  const superagent = superagentDefaults(supertest(app));

  superagent.set('Content-Type', 'application/vnd.api+json');

  return superagent;
}

module.exports = {
  createTestEmail,
  createTestUserData,
  createTestReviewData,
  createJsonApiRecord,
  createJsonApiRequest
};
