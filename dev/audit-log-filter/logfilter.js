console.log('starting')
	// const log = require('./testList.json')
	const _ = require('/home/z/audit-log-filter/node_modules/lodash')
	// ~/x.gitconfig/node_modules/lodash') ;;
	const readline = require('readline')
	const fs = require('fs')

	var e2eLogs =  []
	var userAgents = new Set()
	var tags = new Set()
  
  var testFile;
console.log({testfile1: testFile})
  testFile = fs.readFileSync('/home/z/audit-log-filter/testList.json', 'utf-8')
var testArray = testFile.split('\n')
var json = []

for (var obj of testArray) {
  if (obj.length != '') {
  console.log({obj})
  json.push(JSON.parse(obj))
  }
}
console.log(json)
