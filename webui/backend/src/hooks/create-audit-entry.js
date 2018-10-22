// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.data.name === 'conformance-gce') {
        var dashboards = context.data.dashboard_tab.filter(dashboard => dashboard.branch.includes('dev'))
        var success = await createAuditsFrom(context, dashboards)
    }
    return context;
  };

  async function createAuditsFrom (context, dashboards) {
    var auditService = context.app.service('/api/v1/audits')
    for (var dashboard of dashboards) {
      var artifactsPath = `http://gcsweb.k8s.io/gcs/${dashboard.gcs_prefix}/${dashboard.latestBuild}/artifacts/`
      var existingEntry = await auditService.find({query:{branch: dashboard.name}})
      if (existingEntry.length === 0) {
        auditService.create({
          branch: dashboard.name,
          build: dashboard.latestBuild,
          artifactsPath: artifactsPath
        }).then(res => console.log(`entry made for ${res.branch}!`))
      } else {
        auditService.update(existingEntry[0]._id, {
          branch: dashboard.name,
          build: dashboard.latestBuild,
          artifactsPath: artifactsPath
        }).then(res => console.log('entry updated! for ' + res.branch))
      }
    }
    return 'good job'
  }
}
