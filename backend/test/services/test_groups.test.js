const assert = require('assert');
const app = require('../../src/app');

describe('\'test_groups\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/test_groups');

    assert.ok(service, 'Registered the service');
  });
});
