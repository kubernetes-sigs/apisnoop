const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const avoidDuplicate = require('../../src/hooks/avoid-duplicate');

describe('\'avoidDuplicate\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: avoidDuplicate()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
