// Initializes the `tests` service on path `/api/v1/tests`
const createService = require('feathers-nedb');
const createModel = require('../../models/tests.model');
const hooks = require('./tests.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/tests', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/tests');

  service.hooks(hooks);
};
