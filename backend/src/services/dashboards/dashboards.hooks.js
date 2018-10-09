const cleanupGcsDashboard = require('../../hooks/cleanup-gcs-dashboard');

const addLatestBuild = require('../../hooks/add-latest-build');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [cleanupGcsDashboard(), addLatestBuild()],
    update: [cleanupGcsDashboard(), addLatestBuild()],
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
