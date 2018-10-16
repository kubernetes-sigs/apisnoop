const defaultState = {
  conformance: [],
  test_groups: [],
  dashboards: [],
  dashboard_groups: [],
  loading: true,
  errors: {}
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'FETCH_CONFIG_FULFILLED': {
    var config = action.payload.data
    console.log(config)
      return {
        ...state,
        test_groups: config.test_groups,
        dashboards: config.dashboards,
        dashboard_groups: config.dashboard_groups,
        conformance: config.conformance
        }
    }
    default:
      return state;
    }
}
