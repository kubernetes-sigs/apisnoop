

const avoidDuplicate = require('../../hooks/avoid-duplicate');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [avoidDuplicate()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
