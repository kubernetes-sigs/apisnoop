/* eslint-disable no-unused-vars */
const request = require('request-promise')
const yaml = require('js-yaml')
const fs = require('fs')

var options = {
  url: 'https://api.github.com/repos/kubernetes/test-infra/git/blobs/66c3f57e899a92afc9f6fca20387220a65312915',
  headers: {
    'User-Agent': 'request'
  }
}

class service {
  constructor (options) {
    this.options = options || {};
  }
  // async find (params) {
  //   return [];
  // }
  
  // async get (id, params) {
  //   return {
  //     id, text: `a new message with id: ${id}!`
  //   };
  // }
  
  // async create (data, params) {
  //   if (array.isarray(data)) {
  //     return promise.all(data.map(current => this.create(current, params)));
  //   }
  
  //   return data;
  // }
  
  // async update (id, data, params) {
  //   return data;
  // }
  
  // async patch (id, data, params) {
  //   return data;
  // }
  
  // async remove (id, params) {
  //   return { id };
  // }
  

  async setup (app, params) {
//     request(options).then(blob => {
//       blob = JSON.parse(blob)
//       var content = Buffer.from(blob.content, 'base64').toString()
//       var configGroups =  yaml.safeLoad(content)
//       distribute(app, configGroups)
//     })
   }
 }

 
async function populate (service, configSection) {
  for (var entry of configSection) {
     var existingEntry = await service.find({query:{name: entry.name}})
     if (existingEntry.length === 0) {
       service.create(entry)
     } else {
       service.update(existingEntry[0]._id, entry)
     }
   }
 }


module.exports = function (options) {
  return new service(options);
};

module.exports.service = service;
