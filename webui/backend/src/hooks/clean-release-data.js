const _ = require('lodash')

module.exports = function (options = {}) {
  return async context => {
    var data = context.data.data
    console.log({data: Object.keys(data), name: context.data.name})
    data = cleanUp(data)
    context.data = {name: context.data.name, data: data}
    return context;
  }
}

function cleanUp (obj) {
  var cleanObj = {}
  for (key in obj) {
    if (_.isPlainObject(obj[key])) {
      cleanObj[key.replace(/\./g,'_')] = cleanUp(obj[key])
    } else {
      cleanObj[key.replace(/\./g,'_')] = obj[key]
    }
  }
  return cleanObj
}
