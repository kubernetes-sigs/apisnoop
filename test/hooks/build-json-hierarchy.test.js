const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const buildJsonHierarchy = require('../../src/hooks/build-json-hierarchy');

describe('\'buildJsonHierarchy\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: buildJsonHierarchy()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
