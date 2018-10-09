// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.data.name === 'conformance-gce') {
      console.log('it working')
      console.log({context: context.data.name})
      context = await elaborateUpon(context)
    }
    return context;
  };
  async function elaborateUpon (context) {
    var dashboardTab = context.data.dashboard_tab
    var test_groups = context.app.service('/api/v1/test_groups')
    console.log({d1: context.data.dashboard_tab === dashboardTab})
    dashboardTab = await addGcsPrefix(dashboardTab, test_groups)
    console.log({d2: context.data.dashboard_tab})
    return context
  }

  async function addGcsPrefix (dashboards, test_groups) {
    var promises = dashboards.map(async dashboard => {
      var gcsPrefix = await grabGcsPrefix(dashboard, test_groups)
      dashboard.gcs_prefix = gcsPrefix
      return dashboard
    })
    const results = await Promise.all(promises)
  }

  async function grabGcsPrefix (dashboard, test_groups) {
    var tg = dashboard.test_group_name
    var test_group = await test_groups.find({query: {name: tg}})
    return test_group[0].gcs_prefix
  }
};
