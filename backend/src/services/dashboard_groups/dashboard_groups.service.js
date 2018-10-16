// Initializes the `dashboard_groups` service on path `/api/v1/dashboard_groups`
const createService = require('feathers-nedb');
const createModel = require('../../models/dashboard_groups.model');
const hooks = require('./dashboard_groups.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/dashboard_groups', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/dashboard_groups');

  service.hooks(hooks);
};
