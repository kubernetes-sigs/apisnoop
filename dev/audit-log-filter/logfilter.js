console.log('starting')
	// const log = require('./testList.json')
	const _ = require('/home/z/audit-log-filter/node_modules/lodash')
	// ~/x.gitconfig/node_modules/lodash') ;;
	const readline = require('readline')
	const fs = require('fs')

	var e2eLogs =  []
	var userAgents = new Set()
	var tags = new Set()
  
  var auditLogData;
  auditLogData = fs.readFileSync('/home/z/audit-log-filter/testList.json', 'utf-8')
var auditLogLines = auditLogData.split('\n')
var json = []

for (var obj of auditLogLines) {
  if (obj.length != '') {
  json.push(JSON.parse(obj))
  }
}

for (var item of json) {
  var userAgent = item.userAgent
  console.log({thing: userAgent.match(/e2e.test/)})
}
