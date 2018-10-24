import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'
import { connect } from 'react-redux'

import FiltersList from './filters-list'
import ReleasesList from './releases-list'

class SunburstSegment extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    var uaKeys = Object.keys(this.props.main_release.data.useragents).map(key => {
      return key.replace(/[\[]]/g,'').replace(/_/g,'.')
    })

    var ttKeys = Object.keys(this.props.main_release.data.test_tags).map(key => {
      return key.replace(/[\[\]]/g,'').replace(/_/g,'.')
    })
  }

render() {
  var mainRelease = this.props.main_release
  var userAgents = Object.keys(mainRelease.data.useragents)
  var testTags = Object.keys(mainRelease.data.test_tags)
  const sunburst = mainRelease.data.sunburst
  const selectedAgents = this.props.selected_agents

  var hasAgents = (release) => {
    if (Object.keys(release).length > 0) {
      var keys = Object.keys(release.data.useragents).filter(key => key !== '')
      return keys.length > 0
    }
    return false
  }
  var ise2e = (selectedAgents) => {
    var arrWithe2e = selectedAgents.filter(selected => {
      return selected.includes('e2e_test')})
    return arrWithe2e.length > 0
  }

  const endpoints = this.props.release.endpoints
  console.log({userAgents, selectedAgents, state_user_agents: mainRelease.data.useragents})
  return (
      <div id='sunburst-segment' className='bg_washed-red pa4'>
      <h2>{this.props.version} Sunburst Graph (a visual chart)</h2>
      <SunburstChart
        release={this.props.version}
        sunburst={sunburst}
        endpoints={endpoints}
      />
      <ReleasesList context='Releases' options={this.props.names} selected={[mainRelease.name]} />
       {(hasAgents(mainRelease)) &&
        <FiltersList
          context={'User Agents'}
          options={userAgents}
          selected={selectedAgents}
        />}
    {ise2e(selectedAgents) &&
     <FiltersList
     context={'Test Tags'}
     options={testTags}
     selected={selectedAgents}
     />}
    </div>
  )
}
}

function mapStateToProps (state) {
  return {
    releases: state.releasesStore.releases,
    names: state.releasesStore.names,
    main_release: state.releasesStore.main_release,
    selected_agents: state.releasesStore.selected_agents
  }
}

export default connect(mapStateToProps)(SunburstSegment)
