const assert = require('assert');
const app = require('../../src/app');

describe('\'dashboards\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/dashboards');

    assert.ok(service, 'Registered the service');
  });
});
