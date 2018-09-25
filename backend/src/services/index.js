const cats = require('./cats/cats.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(cats);
};
