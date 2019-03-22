/* eslint-disable no-unused-vars */
const fs = require('fs')
const glob = require('glob')
const dayjs = require('dayjs')

var dataFolder = 'data-gen/processed'

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async setup (app, params) {
    populateAPI(app, dataFolder)
  }
}

function populateAPI (app, dir)  {
  var globOpts = {
    cwd: dir
  }
  populateEndpointsAndTestsAndUseragents(app, globOpts, dir)
  populateReleases(app, globOpts, dir)
}

function populateEndpointsAndTestsAndUseragents (app, opts, dir) {
  glob("**/apisnoop.json", opts, (err, processedAudits) => {
    for (var i = 0; i < processedAudits.length; i++) {
      var fileName = processedAudits[i]
      var releaseJson = fs.readFileSync(`${dir}/${fileName}`, 'utf-8')
      var releaseData = JSON.parse(releaseJson)
      var bucketJobRelease = getBucketJobRelease(fileName)
      addEntryToEndpointService(app, releaseData, bucketJobRelease)
      addEntryToTestService(app, releaseData, bucketJobRelease)
      addEntryToUseragentsService(app, releaseData, bucketJobRelease)
    }
  })
}

function populateReleases (app, opts, dir) {
  glob("**/metadata.json", opts, (err, processedAudits) => {
    for (var i = 0; i < processedAudits.length; i++) {
      var fileName = processedAudits[i]
      var metadataJson = fs.readFileSync(`${dir}/${fileName}`, 'utf-8')
      var metadata = JSON.parse(metadataJson)
      var finishedFile = fileName.replace('metadata.json', 'finished.json')
      var finishedJson = fs.readFileSync(`${dir}/${finishedFile}`, 'utf-8')
      var finishedData = JSON.parse(finishedJson)
      var bucketJobRelease = getBucketJobRelease(fileName)
      addEntryToReleasesService(app, metadata, finishedData, bucketJobRelease)
    }
  })
}

function getBucketJobRelease (fileName) {
  fileNameArr = fileName.split('/')
  console.log(fileNameArr)
  return {
    bucket: fileNameArr[0],
    job: fileNameArr[1],
    release: fileNameArr[0] + "_" + fileNameArr[1]
  }
}

async function addEntryToEndpointService (app, releaseData, bucketJobRelease) {
  var service = app.service('/api/v1/endpoints')
  var endpointNames = Object.keys(releaseData.endpoints)
  var tests = releaseData.tests
  for (var endpointName of endpointNames) {
    var endpointMethods = Object.keys(releaseData.endpoints[endpointName])
    for (var endpointMethod of endpointMethods) {
      var rawEndpoint = releaseData.endpoints[endpointName][endpointMethod]
      var endpoint = {
        name: endpointName,
        method: endpointMethod,
        level: rawEndpoint.level,
        test_tags: rawEndpoint.test_tags,
        tests: rawEndpoint.tests,
        description: rawEndpoint.desc,
        path: rawEndpoint.path,
        useragents: rawEndpoint.useragents,
        category: rawEndpoint.cat,
        isTested: rawEndpoint.counter > 0,
        ...bucketJobRelease
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
async function addEntryToTestService (app, releaseData, bucketJobRelease) {
  var service = app.service('/api/v1/tests')
  var testNames = Object.keys(releaseData.test_sequences)
  for (var testName of testNames) {
    var testSequence = releaseData.test_sequences[testName]
    var test = {
      name: testName,
      sequence: testSequence,
      ...bucketJobRelease

    }
    // An test is unique by testName and Release.
    var uniqueQuery = {
      name: test.name,
      release: test.release
    }
    addOrUpdateEntry(service, test, uniqueQuery)
  }
}

async function addEntryToUseragentsService (app, releaseData, bucketJobRelease) {
  var service = app.service('/api/v1/useragents')
  var useragents = Object.keys(releaseData.useragents)
  for (var useragentEntry of useragents) {
    var touchedEndpoints = releaseData
    var touchedEndpoints = releaseData.useragents[useragentEntry]
    var useragent = {
      name: useragentEntry,
      endpoints: touchedEndpoints,
      ...bucketJobRelease
    }
    // A useragent is unique by Name and Release.
    var uniqueQuery = {
      name: useragent.name,
      release: useragent.release
    }
    addOrUpdateEntry(service, useragent, uniqueQuery)
  }
}

async function addEntryToReleasesService (app, metadata, finishedData, bucketJobRelease) {
  var service = app.service('/api/v1/releases')
  var release = {
    name: bucketJobRelease.release,
    ...metadata,
    ...finishedData,
    ...bucketJobRelease,
    release_short: metadata["job-version"].split("+")[0],
    gathered_datetime: dayjs(finishedData.timestamp * 1000).format('YYYY-MM-DD, HH:mm:ss'),
    version: finishedData["version"].match(/v(.*?)-/)[1]
  }
  // Release is unique by bucket, job, and timestamp
  var uniqueQuery = {
    bucket: release.bucket,
    timestamp: release.timestamp
  }
  addOrUpdateEntry(service, release, uniqueQuery)
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
