const assert = require('assert');
const app = require('../../src/app');

describe('\'github\' service', () => {
  it('registered the service', () => {
    const service = app.service('github');

    assert.ok(service, 'Registered the service');
  });
});
