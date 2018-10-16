// Initializes the `dashboards` service on path `/api/v1/dashboards`
const createService = require('feathers-nedb');
const createModel = require('../../models/dashboards.model');
const hooks = require('./dashboards.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/dashboards', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/dashboards');

  service.hooks(hooks);
};
