/* eslint-disable no-unused-vars */
const fs = require('fs')
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async setup (app, params) {
    populateReleases(app,'../../data/processed-logs')
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
        addEntryToUseragentsService(app, fileName, releaseData)
    }
}

async function addEntryToEndpointService (app, fileName, releaseData) {
    var service = app.service('/api/v1/endpoints')
    var release = fileName.replace('.json', '')
    var endpointNames = Object.keys(releaseData.endpoints)
    var tests = releaseData.tests
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
                tests: rawEndpoint.tests,
                description: rawEndpoint.desc,
                path: rawEndpoint.path,
                category: rawEndpoint.cat,
                isTested: rawEndpoint.counter > 0
            }
            // An endpoint is unique by name, release, method.
            var uniqueQuery = {
                name: endpoint.name,
                method: endpoint.method,
                release: endpoint.release
            }
            addOrUpdateEntry(service, endpoint, uniqueQuery)
        }
    }
}

async function addEntryToTestService (app, fileName, releaseData) {
    var service = app.service('/api/v1/tests')
    var release = fileName.replace('.json', '')
    var testNames = Object.keys(releaseData.test_sequences)
    for (var testName of testNames) {
        var testSequence = releaseData.test_sequences[testName]
        var test = {
            name: testName,
            sequence: testSequence,
            release: release
        }
        // An test is unique by testName and Release.
        var uniqueQuery = {
            name: test.name,
            release: test.release
        }
        addOrUpdateEntry(service, test, uniqueQuery)
    }
}

async function addEntryToUseragentsService (app, fileName, releaseData) {
    var service = app.service('/api/v1/useragents')
    var release = fileName.replace('.json', '')
    var useragents = Object.keys(releaseData.useragents)
    for (var useragentEntry of useragents) {
        var touchedEndpoints = releaseData
        var touchedEndpoints = releaseData.useragents[useragentEntry]
        var useragent = {
            name: useragentEntry,
            endpoints: touchedEndpoints,
            release: release
        }
        // A useragent is unique by Name and Release.
        var uniqueQuery = {
            name: useragent.name,
            release: useragent.release
        }
        addOrUpdateEntry(service, useragent, uniqueQuery)
    }
}

async function addOrUpdateEntry (service, entry, uniqueQuery) {
    var existingEntry = await service.find({query:uniqueQuery})
    if (existingEntry.length === 0) {
        await service.create(entry)
    } else {
        await service.update(existingEntry[0]._id, entry)
    }
}




module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
