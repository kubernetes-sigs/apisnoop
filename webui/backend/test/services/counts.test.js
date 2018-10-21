const assert = require('assert');
const app = require('../../src/app');

describe('\'counts\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/counts');

    assert.ok(service, 'Registered the service');
  });
});
