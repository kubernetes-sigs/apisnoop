import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchReleases, fetchReleaseNames } from '../actions/releases-actions.js'
import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        main_release_name: ''
      }
  }
  componentDidMount() {
    this.props.fetchReleaseNames()
  }

  render(){
    var mainRelease = this.props.main_release
    return (
        <main id='main-splash' className='min-vh-100'>
        {/* {this.props.releases.length !== 0 && <SunburstSegment version={mainRelease.name} release={mainRelease.data}/>}
          <h2>Number of Sunbursts: {this.props.releases.length}</h2> */}
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

export default connect(mapStateToProps, {fetchReleases, fetchReleaseNames})(MainPage)
