const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const downloadAuditLog = require('../../src/hooks/download-audit-log');

describe('\'downloadAuditLog\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: downloadAuditLog()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
