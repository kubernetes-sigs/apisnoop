// Initializes the `sigyaml` service on path `/sigyaml`

const createService = require('./sigyaml.class.js');
const hooks = require('./sigyaml.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sigyaml', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('sigyaml');

  service.hooks(hooks);
};
