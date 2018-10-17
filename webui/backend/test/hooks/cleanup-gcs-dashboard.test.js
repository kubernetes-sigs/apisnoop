const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const cleanupGcsDashboard = require('../../src/hooks/cleanup-gcs-dashboard');

describe('\'cleanup-gcs-dashboard\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: cleanupGcsDashboard()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
