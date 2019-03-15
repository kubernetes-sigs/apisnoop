// Initializes the `releases` service on path `/api/v1/releases`
const createService = require('feathers-nedb');
const createModel = require('../../models/releases.model');
const hooks = require('./releases.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/releases', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/releases');

  service.hooks(hooks);
};
