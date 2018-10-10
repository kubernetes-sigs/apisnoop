// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    console.log({context: context.data.name})
    if (context.data.name === 'conformance-gce') {
      var dashboards = context.data.dashboard_tab
      console.log({dashboards})
      var success = await createAuditsFrom(context, dashboards)
    }
    return context;
  };

  async function createAuditsFrom (context, dashboards) {
    console.log({dashboards2: dashboards})
    var auditService = context.app.service('/api/v1/audits')
    for (var dashboard of dashboards) {
      console.log({dash5: dashboard.latestBuild})
      var auditPath = `http://gcsweb.k8s.io/gcs/${dashboard.gcs_prefix}/${dashboard.latestBuild}/artifacts/`
      var existingEntry = await auditService.find({query:{branch: dashboard.name}})
      console.log({auditPath, existingEntry})
      if (existingEntry.length === 0) {
        auditService.create({
          branch: dashboard.name,
          path: dashboard.branch,
          build: dashboard.latestBuild,
          auditPath: auditPath
        }).then(res => console.log('entry made!', {res}))
      } else {
        console.log('entry already found!', {dashboard})
        service.update(existingEntry[0]._id, {
          branch: dashboard.name,
          path: dashboard.branch,
          build: dashboard.latestBuild,
          auditPath: auditPath
        }).then(res => console.log('entry updated!', {res}))
      }
    }
    return 'good job'
  }
}
