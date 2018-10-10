// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const rp = require('request-promise')

module.exports = function (options = {}) {
  return async context => {
      if (context.data.name === 'conformance-gce') {
        context = await addBuildsForDashboards(context)
      }
    return context;
  };

  async function addBuildsForDashboards (context) {
    var dashboards = context.data.dashboard_tab
    dashboards = await addLatestBuild(dashboards)
    return context
  }

  async function addLatestBuild (dashboards) {
    var promises = dashboards.map(async dashboard => {
      var latestBuild = await grabLatestBuild(dashboard)
      dashboard.latestBuild = latestBuild
      return dashboard
    })
    const results = await Promise.all(promises)
    return results
  }
  async function grabLatestBuild (dashboard) {
    var url = `http://gcsweb.k8s.io/gcs/${dashboard.gcs_prefix}/latest-build.txt`
    var latestBuild = await rp(url)
    return latestBuild
  }
};
