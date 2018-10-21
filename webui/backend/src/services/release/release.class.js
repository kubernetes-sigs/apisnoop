/* eslint-disable no-unused-vars */
const fs = require('fs')

var options = {
}

var services = [
  'statistics',
  'results',
  'unknown_methods',
  'unknown_urls',
  'counts'
]

class service {
  constructor (options) {
    this.options = options || {}
  }

  async setup (app, params) {
    var dir = './jsons/release'
    fs.readdir(dir, (err, jsons) => {
      if (err) {
        console.log({setup_err: err})
      }
      for (var json of jsons) {
        populateServicesFromJson(app,dir, json)
      }
    })
  }
}

async function populateServicesFromJson (app, dir, JSON) {
  fs.readFile(`${dir}/${JSON}`, 'utf-8', (err, results) => {
    if (err) {
      console.log({ERR_populate_json: err})
    }
    parseAndDistribute(app, results, JSON)
  })
}
async function parseAndDistribute (app, results, Name) {
  results = JSON.parse(results)
  var keys = ['statistics', 'results', 'unknown_methods', 'unknown_urls']
  for (var key of keys){
    var service = services.find(service => service.includes(key))
    var section = results[key]
    updateServiceOfSection(app, service, section, Name)
  }
}

async function updateServiceOfSection (app, service, section, name) {
  var appService = app.service(`/api/v1/${service}`)
  name = name.replace('-audit-data.json','')
  var existingEntry = await appService.find({query:{name: name}})
  if (existingEntry.length === 0) {
    appService.create({name, data: section})
    console.log(`Entry Added to ${service} from ${name}`)
  } else {
    appService.update(existingEntry[0]._id, {name, data: section})
    console.log(`Entry Updated for ${service} from ${name}`)
  }
}

module.exports = function (options) {
  return new service(options)
}

module.exports.service = service
