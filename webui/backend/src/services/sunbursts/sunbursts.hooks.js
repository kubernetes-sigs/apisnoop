

const cleanSunburst = require('../../hooks/clean-sunburst');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [cleanSunburst()],
    update: [cleanSunburst()],
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
