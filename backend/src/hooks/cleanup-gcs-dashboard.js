// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.data.name === 'conformance-gce') {
      console.log({context})
      context = await elaborateUpon(context)
    }
    return context;
  };
  async function elaborateUpon (context) {
    console.log({elabContext: context})
    var dashboardTab = context.data.dashboard_tab
    console.log({dashboardTab})
    var test_groups = context.app.service('/api/v1/test_groups')
    dashboardTab = addBranch(dashboardTab)
    dashboardTab = await addGcsPrefix(dashboardTab, test_groups)
    return context
  }

  async function addGcsPrefix (dashboards, test_groups) {
    var promises = dashboards.map(async dashboard => {
      var gcsPrefix = await grabGcsPrefix(dashboard, test_groups)
      dashboard.gcs_prefix = gcsPrefix
      return dashboard
    })
    const results = await Promise.all(promises)
    return results
  }

  async function grabGcsPrefix (dashboard, test_groups) {
    var tg = dashboard.test_group_name
    var test_group = await test_groups.find({query: {name: tg}})
    return test_group[0].gcs_prefix
  }
  function addBranch (dashboards) {
    return dashboards.map(dashboard => {
      var name = dashboard.name.toLowerCase()
      console.log({dName: name})
      if (name.includes('(dev)')) {
        dashboard.branch = 'dev'
      } else if (name.includes('release')) {
        dashboard.branch = 'release'
      } else {
        dashboard.branch = 'none given'
      }
      return dashboard
    })
  }

};
