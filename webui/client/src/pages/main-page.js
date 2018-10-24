import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchReleases } from '../actions/releases-actions.js'
import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        main_release_name: ''
      }
  }
  componentDidMount() {
    this.props.fetchReleases()
  }

  render(){
    var mainRelease = this.props.main_release
    return (
        <main id='main-splash' className='min-vh-100'>
        {this.props.releases.length !== 0 && <SunburstSegment version={mainRelease.name} release={mainRelease.data}/>}
          <h1>This Page Will Have</h1>
          <h2>Number of Sunbursts: {this.props.releases.length}</h2>
          <ul>
          <li>existing sunburst visualization</li>
          <li>tag cloud as taken from our audits</li>
          <li>information about sigs when a sig-tag is present.</li>
          <li>A dropdown for the sunburst to filter by user-agent</li>
          </ul>
        </main>
    )
  }
}

function mapStateToProps (state) {
  return {
    releases: state.releasesStore.releases,
    names: state.releasesStore.names,
    main_release: state.releasesStore.main_release,
    userAgents: state.releasesStore.useragents
  }
}

export default connect(mapStateToProps, {fetchReleases})(MainPage)
