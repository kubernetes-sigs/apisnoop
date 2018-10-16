const assert = require('assert');
const app = require('../../src/app');

describe('\'config\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/config');

    assert.ok(service, 'Registered the service');
  });
});
