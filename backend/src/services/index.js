const cats = require('./cats/cats.service.js');
const contact = require('./contact/contact.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(cats);
  app.configure(contact);
};
