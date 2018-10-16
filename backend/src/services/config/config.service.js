// Initializes the `config` service on path `/api/v1/config`
const createService = require('./config.class.js');
const hooks = require('./config.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/config', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/config');

  service.hooks(hooks);
};
