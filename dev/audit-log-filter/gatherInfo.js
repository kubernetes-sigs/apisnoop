module.exports = () => {
          const fs = require('fs')
          // const fetch = require('/home/z/apisnoop/dev/audit-log-filter/node_modules/node-fetch')
          const request = require('/home/z/apisnoop/dev/audit-log-filter/node_modules/request')

          var e2eLogs =  []
          var userAgents = new Set()
          var tags = new Set()
          var commit = null
          var openApi = null
          var tests = new Set()

          var auditLogData;
          auditLogData = fs.readFileSync('/home/z/audit-log-filter/e2e-conformance-noslow-master.audit.log', 'utf-8')
          // auditLogData = fs.readFileSync('/home/z/audit-log-filter/testList.json', 'utf-8')
        var auditLogLines = auditLogData.split('\n')
        var auditLog = []

        for (var auditLogLine of auditLogLines) {
          if (auditLogLine.includes('e2e.test/v')) {
          auditLog.push(JSON.parse(auditLogLine))
          }
        }

        for (var logEntry of auditLog) {
          if (!commit) gatherCommit(logEntry)
          if (commit && !openApi) gatherOpenApi(commit)
          gatherTests(logEntry)
          gatherTags(logEntry)
        }

  function gatherTests (entry) {
    var match = entry.userAgent.match(/(?:-- )((.*))/)
    if (match) {
      test = match[1]
      tests.add(test)
      } 
    }

  function gatherCommit (entry) {
    var match = entry.userAgent.match(/(?:kubernetes\/)((.*?)) /)
    if (match) {
      commit = match[1]
request(`https://raw.githubusercontent.com/kubernetes/kubernetes/${commit}/api/openapi-spec/swagger.json`, 
{ json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.paths['/api/'])
});
  }
}
  function gatherOpenApi (commit) {
    request(`https://raw.githubusercontent.com/kubernetes/kubernetes/${commit}/api/openapi-spec/swagger.json`, 
    { json: true }, 
    (err, res, body) => {
      if (err) { return console.log(err); }
      openApi = body
      fs.writeFileSync('swaggerSave.json', body)
      console.log('hello')
    });
}

  function gatherTags (entry) {
    var userAgent = entry.userAgent
    var agentTags = userAgent.match(/(\[(.*?)\])/g)
    if (agentTags) {
    for (var tag of agentTags) {
      tags.add(tag)
      } 
    } else {
        // console.log({otherTag: userAgent})
    }
  }
   var tagArray = [...tags]
   var testArray = [...tests]
   return {commit, tagArray, testArray, openApi}
  }
