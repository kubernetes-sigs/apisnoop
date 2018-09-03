const log = require('./testList.json')
const _ = require('lodash')

const readline = require('readline')
const fs = require('fs')

var userAgents = new Set()
var tags = new Set()

// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
const rl = readline.createInterface({
    input: fs.createReadStream('./testList.json'),
    crlfDelay: Infinity
})

rl.on()
var e2eLogs = log.filter(entry => {
  return entry.userAgent.includes('e2e.test')
  })

for (var obj of e2eLogs) {
  userAgent = obj.userAgent
  userAgents.add(userAgent)
  var regex = /(\[(.*?)\])/
  var agentTags = userAgent.match(regex)
  debugger
  console.log(agentTags)
//  for (var tag of agentTags) {
//    tags.add(tag)
//  }
}


