const assert = require('assert');
const app = require('../../src/app');

describe('\'cats\' service', () => {
  it('registered the service', () => {
    const service = app.service('cats');

    assert.ok(service, 'Registered the service');
  });
});
