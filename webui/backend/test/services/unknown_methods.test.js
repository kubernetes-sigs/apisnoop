const assert = require('assert');
const app = require('../../src/app');

describe('\'unknown_methods\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/unknown_methods');

    assert.ok(service, 'Registered the service');
  });
});
