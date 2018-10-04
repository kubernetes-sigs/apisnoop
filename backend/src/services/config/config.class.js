const request = require('request-promise')
const yaml = require('js-yaml')

/* eslint-disable no-unused-vars */
var options = {
  url: 'https://api.github.com/repos/kubernetes/test-infra/git/blobs/66c3f57e899a92afc9f6fca20387220a65312915',
  headers: {
    'User-Agent': 'request'
  }
}

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return request(options).then(blob => {
      blob = JSON.parse(blob)
      var content = Buffer.from(blob.content, 'base64').toString()
      return yaml.safeLoad(content)
    })
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
