// Initializes the `audits` service on path `/api/v1/audits`
const createService = require('feathers-nedb');
const createModel = require('../../models/audits.model');
const hooks = require('./audits.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/audits', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/audits');

  service.hooks(hooks);
};
