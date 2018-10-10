const config = require('./config/config.service.js');
const testGroups = require('./test_groups/test_groups.service.js');
const dashboards = require('./dashboards/dashboards.service.js');
const dashboardGroups = require('./dashboard_groups/dashboard_groups.service.js');
const audits = require('./audits/audits.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(config);
  app.configure(testGroups);
  app.configure(dashboards);
  app.configure(dashboardGroups);
  app.configure(audits);
};
