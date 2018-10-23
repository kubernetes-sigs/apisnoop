import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchReleases } from '../actions/releases-actions.js'
import SunburstSegment from '../components/sunburst-segment'
// import BranchList from '../components/branch-list'

class MainPage extends Component {
  componentDidMount() {
    this.props.fetchReleases()
  }

  render(){
    return (
        <main id='main-splash' className='min-vh-100'>
        {this.props.releases.length !== 0 && <SunburstSegment version={this.props.releases[0].name} sunburst={this.props.releases[0].data}/>}
        <div id='branch-statistics'>
        {/* <BranchList statistics={this.props.statistics} /> */}
        </div>
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
    releases: state.releasesStore.releases
  }
}

export default connect(mapStateToProps, {fetchReleases})(MainPage)
