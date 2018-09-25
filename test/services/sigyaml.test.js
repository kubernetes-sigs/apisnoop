const assert = require('assert');
const app = require('../../src/app');

describe('\'sigyaml\' service', () => {
  it('registered the service', () => {
    const service = app.service('sigyaml');

    assert.ok(service, 'Registered the service');
  });
});
