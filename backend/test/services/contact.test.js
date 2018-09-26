const assert = require('assert');
const app = require('../../src/app');

describe('\'contact\' service', () => {
  it('registered the service', () => {
    const service = app.service('contact');

    assert.ok(service, 'registered the service');
  });
});
