

const cleanSunburst = require('../../hooks/clean-sunburst');

const buildJsonHierarchy = require('../../hooks/build-json-hierarchy');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [cleanSunburst(), buildJsonHierarchy()],
    update: [cleanSunburst(), buildJsonHierarchy()],
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
