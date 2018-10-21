// Initializes the `results` service on path `/api/v1/results`
const createService = require('feathers-nedb');
const createModel = require('../../models/results.model');
const hooks = require('./results.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/results', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/results');

  service.hooks(hooks);
};
