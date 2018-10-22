const _ = require('lodash')

module.exports = function (options = {}) {
  return async context => {
    var data = context.data.data
    data = cleanUp(data)
    console.log({sunburst: Object.keys(data.tree)})
    context.data = {name: context.data.name, data}
    return context;
  }
}

function cleanUp (obj) {
  var cleanObj = {}
  for (key in obj) {
    if (Object.prototype.toString.apply(obj[key]) === '[object Object]') {
      cleanObj[key.replace(/\./g,'_')] = cleanUp(obj[key])
    } else {
      cleanObj[key.replace(/\./g,'_')] = obj[key]
    }
  }
    return cleanObj
}
