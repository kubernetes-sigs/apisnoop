const _ = require('lodash')
const fs = require('fs')
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    var entry = context.data
    var build = _.words(entry.branch, /([0-9]|\.)/g).join('')
    var jsons = fs.readdirSync('./jsons')
    var json = jsons.filter(fileName => fileName.includes(build) && fileName.includes('.json'))[0]
    var rawString = fs.readFileSync(`./jsons/${json}`, 'utf-8')
    context.data.data = JSON.parse(rawString)
    console.log({context: context.data})
    return context;
  };
};
