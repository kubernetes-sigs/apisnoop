const config = require('./config/config.service.js');
const releases = require('./releases/releases.service.js');
const endpoints = require('./endpoints/endpoints.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(config);
  app.configure(releases);
  app.configure(endpoints);
};
