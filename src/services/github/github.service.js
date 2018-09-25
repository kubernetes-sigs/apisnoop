// Initializes the `github` service on path `/github`
const createService = require('feathers-nedb');
const createModel = require('../../models/github.model');
const hooks = require('./github.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/github', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('github');

  service.hooks(hooks);
};
