const assert = require('assert');
const app = require('../../src/app');

describe('\'dashboard_groups\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/dashboard_groups');

    assert.ok(service, 'Registered the service');
  });
});
