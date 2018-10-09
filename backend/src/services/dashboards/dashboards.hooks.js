const cleanupGcsDashboard = require('../../hooks/cleanup-gcs-dashboard');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [cleanupGcsDashboard()],
    update: [cleanupGcsDashboard()],
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
