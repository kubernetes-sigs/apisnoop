const config = require('./config/config.service.js');
const testGroups = require('./test_groups/test_groups.service.js');
const dashboards = require('./dashboards/dashboards.service.js');
const dashboardGroups = require('./dashboard_groups/dashboard_groups.service.js');
const audits = require('./audits/audits.service.js');
const counts = require('./counts/counts.service.js');
const statistics = require('./statistics/statistics.service.js');
const unknownUrls = require('./unknown_urls/unknown_urls.service.js');
const results = require('./results/results.service.js');
const tests = require('./tests/tests.service.js');
const release = require('./release/release.service.js');
const unknownMethods = require('./unknown_methods/unknown_methods.service.js');
const sunbursts = require('./sunbursts/sunbursts.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(config);
  app.configure(testGroups);
  app.configure(dashboards);
  app.configure(dashboardGroups);
  app.configure(audits);
  app.configure(counts);
  app.configure(statistics);
  app.configure(unknownUrls);
  app.configure(results);
  app.configure(tests);
  app.configure(release);
  app.configure(unknownMethods);
  app.configure(sunbursts);
};
