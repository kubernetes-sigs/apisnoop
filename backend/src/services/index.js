const cats = require('./cats/cats.service.js');
const config = require('./config/config.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(cats);
  app.configure(config);
};
