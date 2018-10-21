const assert = require('assert');
const app = require('../../src/app');

describe('\'statistics\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/statistics');

    assert.ok(service, 'Registered the service');
  });
});
