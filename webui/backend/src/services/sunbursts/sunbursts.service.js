// Initializes the `sunbursts` service on path `/api/v1/sunbursts`
const createService = require('feathers-nedb');
const createModel = require('../../models/sunbursts.model');
const hooks = require('./sunbursts.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/sunbursts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/sunbursts');

  service.hooks(hooks);
};
