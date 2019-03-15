const assert = require('assert');
const app = require('../../src/app');

describe('\'useragents\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/useragents');

    assert.ok(service, 'Registered the service');
  });
});
