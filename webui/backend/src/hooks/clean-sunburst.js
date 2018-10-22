const _ = require('lodash')

module.exports = function (options = {}) {
  return async context => {
    var data = context.data.data.starburst
    data.alpha = cleanUp(data.alpha)
    data.beta = cleanUp(data.beta)
    data.stable = cleanUp(data.stable)
    context.data = {name: context.data.name, data}
    return context;
  };
};

function cleanUp (obj) {
  var keys = Object.keys(obj)
  for (var key of keys) {
    obj[key] = periodToUnderscore(obj[key])
  }
  return obj
}

function periodToUnderscore (obj) {
  return _.mapKeys(obj, (value, key) => {
    var _key_ = key.replace(/\./g, '_')
    return _key_
  })
}
