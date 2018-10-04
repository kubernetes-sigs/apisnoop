// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    context.result.conformance = []
    var conformanceGCE = context.result.dashboards.find(dashboard => {
      return dashboard.name === 'conformance-gce'
    })
    Object.assign(context.result.conformance, conformanceGCE.dashboard_tab)
  };
};
