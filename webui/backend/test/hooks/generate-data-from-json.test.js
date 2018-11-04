const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const generateDataFromJson = require('../../src/hooks/generate-data-from-json');

describe('\'generateDataFromJson\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: generateDataFromJson()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
