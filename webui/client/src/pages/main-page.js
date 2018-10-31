import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { fetchEndpoints } from '../actions/endpoints'
import { focusChart } from '../actions/charts'
import {
  selectActiveRoute,
  selectEndpointsById,
  selectEndpointsByReleaseAndNameAndMethod,
  selectRouteChange,
  selectIsSunburstReady,
  selectSunburstByReleaseWithSortedLevel
} from '../selectors'

import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  render(){
  const { activeRoute, routeChange, sunburstByRelease } = this.props
  const releaseBasedOnRoute = this.props.location.pathname.replace('/','')

    return (
        <main id='main-splash' className='min-vh-100'>
        <h2>You are doing a good job.</h2>
        {this.props.isSunburstReady && <SunburstSegment
         sunburst={{
           data: routeChange ? sunburstByRelease.dataByRelease[activeRoute] : sunburstByRelease.dataByRelease[releaseBasedOnRoute],
           focusedLabel: this.props.sunburstByRelease.focusedLabel
         }}
         focusChart={this.props.focusChart}
         release= {activeRoute}
         />
        }
      </main>
    )
  }
}

export default connect(
  createStructuredSelector({
    activeRoute: selectActiveRoute,
    endpointsById: selectEndpointsById,
    endpointsByReleaseAndNameAndMethod: selectEndpointsByReleaseAndNameAndMethod,
    isSunburstReady: selectIsSunburstReady,
    routeChange: selectRouteChange,
    sunburstByRelease: selectSunburstByReleaseWithSortedLevel,

  }),
  {fetchEndpoints, focusChart}
) (MainPage)
