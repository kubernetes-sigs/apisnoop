const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const acquireAuditLog = require('../../src/hooks/acquire-audit-log');

describe('\'acquireAuditLog\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: acquireAuditLog()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
