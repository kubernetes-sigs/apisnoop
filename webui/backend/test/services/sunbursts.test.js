const assert = require('assert');
const app = require('../../src/app');

describe('\'sunbursts\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/sunbursts');

    assert.ok(service, 'Registered the service');
  });
});
