// Initializes the `statistics` service on path `/api/v1/statistics`
const createService = require('feathers-nedb');
const createModel = require('../../models/statistics.model');
const hooks = require('./statistics.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/statistics', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/statistics');

  service.hooks(hooks);
};
