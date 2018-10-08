const assert = require('assert');
const app = require('../../src/app');

describe('\'dashboard_names\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/dashboard_names');

    assert.ok(service, 'Registered the service');
  });
});
