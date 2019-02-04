const assert = require('assert');
const app = require('../../src/app');

describe('\'unknown_urls\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/unknown_urls');

    assert.ok(service, 'Registered the service');
  });
});
