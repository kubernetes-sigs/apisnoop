import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'
import { connect } from 'react-redux'

import ReleasesList from './releases-list'

class SunburstSegment extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
  }

render() {
  var mainRelease = this.props.main_release
  const sunburst = mainRelease.data.sunburst
  const selectedAgents = this.props.selected_agents
  const endpoints = this.props.release.endpoints
  return (
      <div id='sunburst-segment' className='bg_washed-red pa4'>
      <h2>{this.props.version} Sunburst Graph (a visual chart)</h2>
      <SunburstChart
        release={this.props.version}
        sunburst={sunburst}
        endpoints={endpoints}
      />
      <ReleasesList context='Releases' options={this.props.names} selected={[mainRelease.name]} />
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
