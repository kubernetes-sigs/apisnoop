// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const rp = require('request-promise')
const fs = require('fs')
const _ = require('lodash')

module.exports = function (options = {}) {
  return async context => {
    var logPath = context.data.auditLogArray
    var branch = context.data.branch
    writeToFile(branch, logPath)
    return context;
  }
  function writeToFile(branch, path) {
    var regex = /(,|.| |\(|\))/g
    var formattedPath = _.replace(branch, regex, formatByPattern)
    var fileName = `${formattedPath}audit.log`
    var writeStream = fs.createWriteStream(`./data/audit-logs/${fileName}`)
    rp(path)
      .then(response => {
        console.log('Starting to write file for:' + '\n' + fileName + '\n' + 'from:' + '\n' + path)
        writeStream.write(response)
        writeStream.end()
        writeStream.on('finish', () => console.log(`file written: ./data/audit-logs/${fileName}!`))
        writeStream.on('error', (err) => console.log(`error for ${fileName}: ${err}`))})
      .catch(err => console.log('request promise error: ' + err))
  }
  function formatByPattern (str) {
    switch (str) {
      case ',':
      case ')':
        return '_'
      case '(':
      case '.':
        return '-'
      case ' ':
        return ''
      default:
        return str
    }
  }
}
