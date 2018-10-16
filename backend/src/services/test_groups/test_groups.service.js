// Initializes the `test_groups` service on path `/api/v1/test_groups`
const createService = require('feathers-nedb');
const createModel = require('../../models/test_groups.model');
const hooks = require('./test_groups.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/test_groups', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/test_groups');

  service.hooks(hooks);
};
