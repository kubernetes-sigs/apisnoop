// Initializes the `endpoints` service on path `/api/v1/endpoints`
const createService = require('feathers-nedb');
const createModel = require('../../models/endpoints.model');
const hooks = require('./endpoints.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/endpoints', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/endpoints');

  service.hooks(hooks);
};
