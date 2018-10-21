// Initializes the `unknown_methods` service on path `/api/v1/unknown_methods`
const createService = require('feathers-nedb');
const createModel = require('../../models/unknown_methods.model');
const hooks = require('./unknown_methods.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/unknown_methods', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/unknown_methods');

  service.hooks(hooks);
};
