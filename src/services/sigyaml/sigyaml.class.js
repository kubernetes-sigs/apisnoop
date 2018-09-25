const yaml = require('js-yaml')
const request = require('request-promise')

var options = {
  url: 'https://api.github.com/repos/kubernetes/community/git/blobs/527caa760f44674dbca2a125ddf5233c71754f0d',
  headers: {
    'User-Agent': 'request'
  }
}

/* eslint-disable no-unused-vars */

class Service {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    return request(options).then(blob => {
      blob = JSON.parse(blob)
      var content = Buffer.from(blob.content, 'base64').toString()
      return yaml.safeLoad(content)
    })
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
