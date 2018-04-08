const create = {
  email: {
    type: 'string',
    format: 'email',
    required: true
  },
  password: {
    type: 'string',
    required: true,
    minLength: 1
  }
};

module.exports = {
  create
};
