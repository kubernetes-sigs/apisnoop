const sigyaml = require('./sigyaml/sigyaml.service.js');
const github = require('./github/github.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(sigyaml);
  app.configure(github);
};
