

const acquireAuditLog = require('../../hooks/acquire-audit-log');

const downloadAuditLog = require('../../hooks/download-audit-log');

const generateDataFromJson = require('../../hooks/generate-data-from-json');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [acquireAuditLog(), generateDataFromJson()],
    update: [acquireAuditLog(), generateDataFromJson()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [downloadAuditLog()],
    update: [downloadAuditLog()],
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
