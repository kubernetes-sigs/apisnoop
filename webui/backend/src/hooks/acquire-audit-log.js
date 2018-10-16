// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const rp = require('request-promise')
const cheerio = require('cheerio')

module.exports = function (options = {}) {
  return async context => {
    var auditLogPage = context.data.artifactsPath + 'bootstrap-e2e-master/'
    var auditLogArray = await crawlPage(auditLogPage)
    context.data.auditLogArray = auditLogArray
    return context;
  };

  function crawlPage (page)  {
    var options = {
      uri: page,
      transform: (body) => cheerio.load(body)
    }
    return rp(options).then(($) => {
      var links = $('.pure-u-2-5 a:first-of-type:contains(audit)').attr('href')
      return links
    })
  }
}
