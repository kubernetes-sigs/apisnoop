// Initializes the `unknown_urls` service on path `/api/v1/unknown_urls`
const createService = require('feathers-nedb');
const createModel = require('../../models/unknown_urls.model');
const hooks = require('./unknown_urls.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/unknown_urls', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/unknown_urls');

  service.hooks(hooks);
};
