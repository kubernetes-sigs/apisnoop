

const acquireAuditLog = require('../../hooks/acquire-audit-log');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [acquireAuditLog()],
    update: [acquireAuditLog()],
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
