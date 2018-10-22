import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchAudits } from '../actions/audits-actions'
import { fetchStatistics } from '../actions/statistics-actions'
import { fetchSunbursts } from '../actions/sunbursts-actions'
import SunburstSegment from '../components/sunburst-segment'
import BranchList from '../components/branch-list'

class MainPage extends Component {
  componentDidMount() {
    this.props.fetchAudits()
    this.props.fetchStatistics()
    this.props.fetchSunbursts()
  }

  render(){
    return (
        <main id='main-splash' className='min-vh-100'>
          {this.props.sunbursts.length !== 0 && <SunburstSegment version={this.props.sunbursts[0].name} sunburst={this.props.sunbursts[0]}/>}
        <div id='branch-statistics'>
        <BranchList statistics={this.props.statistics} />
        </div>
          <h1>This Page Will Have</h1>
          <h2>Number of Sunbursts: {this.props.sunbursts.length}</h2>
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
    sunbursts: state.sunburstsStore.sunbursts,
    statistics: state.statisticsStore.statistics
  }
}

export default connect(mapStateToProps, {fetchAudits, fetchSunbursts, fetchStatistics})(MainPage)
