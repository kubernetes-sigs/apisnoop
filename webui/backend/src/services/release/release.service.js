// Initializes the `release` service on path `/api/v1/release`
const createService = require('./release.class.js');
const hooks = require('./release.hooks');

module.exports = function (app) {

  const options = {
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/release', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/release');

  service.hooks(hooks);
};
