

const cleanReleaseData = require('../../hooks/clean-release-data');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [cleanReleaseData()],
    update: [cleanReleaseData()],
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
