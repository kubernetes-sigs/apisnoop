import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchRelease } from '../actions/releases.js'
import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  constructor (props) {
    super(props)
    this.findRelease = this.findRelease.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.release_names !== prevProps.release_names) {
      var release = this.findRelease(this.props.release_names, this.props.location.pathname)
      this.props.fetchRelease(release._id)
    }
  }

  findRelease (release_names, path) {
    var pathName = path.replace(/\//,'')
    return release_names.find(release => release.name === pathName)
  }


  render(){
    var {active_release, loading} = this.props
    return (
        <main id='main-splash' className='min-vh-100'>
        <h1>You made it to the MainPage</h1>
        {!loading && <SunburstSegment release={active_release.name} sunburst={active_release.sunburst} endpoints={active_release.endpoints}/>}
      </main>
    )
  }
}

function mapStateToProps (state) {
  return {
    release_names: state.releasesStore.release_names,
    active_release: state.releasesStore.active_release,
    loading: state.releasesStore.loading
  }
}

export default connect(mapStateToProps, {fetchRelease})(MainPage)
