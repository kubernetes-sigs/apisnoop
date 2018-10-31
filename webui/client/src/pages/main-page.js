import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { fetchEndpoints } from '../actions/endpoints'
import { selectEndpointsById, selectEndpointsByReleaseAndNameAndMethod, selectSunburstByRelease, selectIsSunburstReady } from '../selectors'

import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  constructor (props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
  }

  render(){
    return (
        <main id='main-splash' className='min-vh-100'>
        <h1>You made it to the MainPage</h1>
        <h2>You are doing a good job.</h2>
      {this.props.isSunburstReady && <SunburstSegment
          sunburst={this.props.sunburstByRelease['sig-release-1.12']}
        />
      }
      </main>
    )
  }
}

export default connect(
  createStructuredSelector({
    endpointsById: selectEndpointsById,
    endpointsByReleaseAndNameAndMethod: selectEndpointsByReleaseAndNameAndMethod,
    sunburstByRelease: selectSunburstByRelease,
    isSunburstReady: selectIsSunburstReady
  }),
  {fetchEndpoints}
) (MainPage)
