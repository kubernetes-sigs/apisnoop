import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchAudits } from '../actions/audits-actions'
import { fetchStatistics } from '../actions/statistics-actions'
import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  componentDidMount() {
    this.props.fetchAudits()
    this.props.fetchStatistics()
  }

  render(){
    return (
        <main id='main-splash' className='min-vh-100'>
          {this.props.audits.length !== 0 && <SunburstSegment version='First' audits={this.props.audits}/>}
          <h1>This Page Will Have</h1>
          <h2>Number of Audits: {this.props.audits.length}</h2>
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
    audits: state.auditsStore.audits,
    statistics: state.statisticsStore.statistics
  }
}

export default connect(mapStateToProps, {fetchAudits, fetchStatistics})(MainPage)
