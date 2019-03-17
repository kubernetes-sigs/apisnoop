const assert = require('assert');
const app = require('../../src/app');

describe('\'endpoints\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/endpoints');

    assert.ok(service, 'Registered the service');
  });
});
