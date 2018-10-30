const defaultState = {
  releases: [],
  main_release: {},
  names: [],
  selected_agents: [],
  loading: true,
  errors: {}
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
  case 'FETCH_RELEASE_NAMES_FULFILLED': {
    return {
      ...state,
      release_names: action.payload.data
    }
  }
  case 'FETCH_RELEASES_FULFILLED': {
    var masterRelease = action.payload.data.find(data => {
      return data.name.toLowerCase().includes('master')
    })
    var selectedAgents = Object.keys(masterRelease.data.useragents).filter(key => {
      if (key.match(/e2e/)) {
        return key
      }
    })
    return {
      ...state,
      releases: action.payload.data,
      names: action.payload.data.map(data => {
        data = data.name
        return data
      }),
      main_release: masterRelease,
      selected_agents: selectedAgents,
      loading: false
    }
  }
  case 'NEW_MAIN_CHOSEN': {
    var newMain = state.releases.find(release => {
      return release.name === action.payload
    })
    var selectedAgents = Object.keys(newMain.data.useragents).filter(key => {
      if (key.match(/e2e/)) {
        return key
      }
    })
    return {
      ...state,
      main_release: newMain,
      selected_agents: selectedAgents
    }
  }
  default:
    return state;
  }
}
