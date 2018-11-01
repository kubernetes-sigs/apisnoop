import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { focusChart, setInteriorLabel, unfocusChart } from '../actions/charts'
import {
  selectActiveRoute,
  selectEndpointsById,
  selectEndpointsByReleaseAndNameAndMethod,
  selectFocusPathAsArray,
  selectFocusPathAsString,
  selectRouteChange,
  selectIsSunburstReady,
  selectSunburstByReleaseWithSortedLevel
} from '../selectors'

import SunburstSegment from '../components/sunburst-segment'

class MainPage extends Component {
  render(){
    const {
      activeRoute,
      focusPath,
      focusPathAsString,
      routeChange,
      sunburstByRelease
    } = this.props

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
         unfocusChart={this.props.unfocusChart}
         release= {activeRoute}
         focusPathAsString={focusPathAsString}
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
    focusPath: selectFocusPathAsArray,
    focusPathAsString: selectFocusPathAsString,
    endpointsByReleaseAndNameAndMethod: selectEndpointsByReleaseAndNameAndMethod,
    isSunburstReady: selectIsSunburstReady,
    routeChange: selectRouteChange,
    sunburstByRelease: selectSunburstByReleaseWithSortedLevel
  }),
  {focusChart, unfocusChart}
) (MainPage)
