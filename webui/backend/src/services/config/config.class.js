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
    var releaseJson = fs.readFileSync(`${dir}/${fileName}`, 'utf-8')
    var releaseData = JSON.parse(releaseJson)
    addEntryToEndpointService(app, fileName, releaseData)
    addEntryToTestService(app, fileName, releaseData)
  }
}

// I think we will not need this soon.
async function addEntryToReleaseService (app, fileName, releaseData) {
  var service = app.service('/api/v1/releases')
  var name = fileName.replace('-processed-audit.json', '')
  var existingEntry = await service.find({query:{name}})
  if (existingEntry.length === 0) {
    service.create({name: name, data: releaseData})
  } else {
    service.update(existingEntry[0]._id, {name: name, data: releaseData})
  }
}

async function addEntryToEndpointService (app, fileName, releaseData) {
  var service = app.service('/api/v1/endpoints')
  var release = fileName.replace('-processed-audit.json', '')
  var endpointNames = Object.keys(releaseData.endpoints)
  for (var endpointName of endpointNames) {
    var endpointMethods = Object.keys(releaseData.endpoints[endpointName])
    for (var endpointMethod of endpointMethods) {
      var rawEndpoint = releaseData.endpoints[endpointName][endpointMethod]
      var endpoint = {
        name: endpointName,
        method: endpointMethod,
        release: release,
        level: rawEndpoint.level,
        test_tags: rawEndpoint.test_tags,
        description: rawEndpoint.desc,
        path: rawEndpoint.path,
        category: rawEndpoint.cat,
        isTested: rawEndpoint.counter > 0
      }
      // An endpoint is unique by name, release, method.
      var existingEntry = await service.find({
        query:{
          name: endpoint.name,
          method: endpoint.method,
          release: endpoint.release
        }
      })
      if (existingEntry.length === 0) {
        await service.create(endpoint)
      } else {
        await service.update(existingEntry[0]._id, endpoint)
      }
    }
  }
}

async function addEntryToTestService (app, fileName, releaseData) {
  var service = app.service('/api/v1/tests')
  var release = fileName.replace('-processed-audit.json', '')
  var testNames = Object.keys(releaseData.test_sequences)
  for (var testName of testNames) {
    var testSequence = releaseData.test_sequences[testName]
    var test = {
      name: testName,
      sequence: testSequence,
      release: release
    }
    // An test is unique by testName and Release.
    var existingEntry = await service.find({
      query:{
        name: test.name,
        release: test.release
      }
    })
    if (existingEntry.length === 0) {
      await service.create(test)
    } else {
      await service.update(existingEntry[0]._id, test)
    }
  }
}


module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
