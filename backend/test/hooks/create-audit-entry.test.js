const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const createAuditEntry = require('../../src/hooks/create-audit-entry');

describe('\'createAuditEntry\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      error: createAuditEntry()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
