// Initializes the `config` service on path `/config`
const createService = require('./config.class.js');
const hooks = require('./config.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/config', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('config');

  service.hooks(hooks);
};
