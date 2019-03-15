const assert = require('assert');
const app = require('../../src/app');

describe('\'releases\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/releases');

    assert.ok(service, 'Registered the service');
  });
});
