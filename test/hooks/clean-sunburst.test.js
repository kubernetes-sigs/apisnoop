const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const cleanSunburst = require('../../src/hooks/clean-sunburst');

describe('\'cleanSunburst\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: cleanSunburst()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
