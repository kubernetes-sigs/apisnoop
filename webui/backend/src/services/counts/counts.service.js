// Initializes the `counts` service on path `/api/v1/counts`
const createService = require('feathers-nedb');
const createModel = require('../../models/counts.model');
const hooks = require('./counts.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/counts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/counts');

  service.hooks(hooks);
};
