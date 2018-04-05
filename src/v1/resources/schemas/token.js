const create = {
  email: {
    type: 'string',
    format: 'email',
    required: true
  },
  password: {
    type: 'string',
    required: true
  }
};

module.exports = {
  create
};
