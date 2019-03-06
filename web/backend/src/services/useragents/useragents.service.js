// Initializes the `useragents` service on path `/api/v1/useragents`
const createService = require('feathers-nedb');
const createModel = require('../../models/useragents.model');
const hooks = require('./useragents.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/useragents', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/useragents');

  service.hooks(hooks);
};
