const create = {
  email: {
    type: 'string',
    format: 'email',
    required: true
  },
  password: {
    type: 'string',
    required: true,
    minLength: 6
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1
  }
};

const update = {
  name: {
    type: 'string'
  },
  pictureData: {
    type: 'string',
    format: 'data-uri'
  }
};

module.exports = {
  create,
  update
};
