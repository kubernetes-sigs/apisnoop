/* eslint-disable no-unused-vars */
const fs = require('fs')
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async setup (app, params) {
    populateReleases(app,'./data/processed-audits')
  }
}

function populateReleases (app, dir)  {
  var processedAudits = fs.readdirSync(dir)
  for (var i = 0; i < processedAudits.length; i++) {
    var fileName = processedAudits[i]
    var data = fs.readFileSync(`${dir}/${fileName}`, 'utf-8')
    addEntryToService(app, fileName, data)
  }
}

async function addEntryToService (app, fileName, data) {
  var service = app.service('/api/v1/releases')
  var name = fileName.replace('-processed-audit.json', '')
  var json = JSON.parse(data)
  var existingEntry = await service.find({query:{name}})
  if (existingEntry.length === 0) {
    service.create({name: name, data: json})
  } else {
    service.update(existingEntry[0]._id, {name: name, data: json})
  }
}


module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
