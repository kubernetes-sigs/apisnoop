import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { focusChart, unfocusChart } from '../actions/charts'
import {
  selectActiveRoute,
  selectFocusPathAsArray,
  selectFocusPathAsString,
  selectInteriorLabel,
  selectReleaseNamesFromEndpoints,
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
      interiorLabel,
      routeChange,
      sunburstByRelease
    } = this.props

    const releaseBasedOnRoute = this.props.location.pathname.replace('/','')

    return (
        <main id='main-splash' className='min-vh-100'>
        <h2>You are doing a good job.</h2>
        {this.props.isSunburstReady && <SunburstSegment
         sunburst={{
           data: routeChange ? sunburstByRelease.dataByRelease[activeRoute]
             : sunburstByRelease.dataByRelease[releaseBasedOnRoute]
         }}
         focusChart={this.props.focusChart}
         unfocusChart={this.props.unfocusChart}
         release= {activeRoute}
         focusPath={focusPath}
         focusPathAsString={focusPathAsString}
         interiorLabel={interiorLabel}
         />
        }
      </main>
    )
  }
}

export default connect(
  createStructuredSelector({
    activeRoute: selectActiveRoute,
    focusPath: selectFocusPathAsArray,
    focusPathAsString: selectFocusPathAsString,
    isSunburstReady: selectIsSunburstReady,
    interiorLabel: selectInteriorLabel,
    releaseNames: selectReleaseNamesFromEndpoints,
    routeChange: selectRouteChange,
    sunburstByRelease: selectSunburstByReleaseWithSortedLevel
  }),
  {focusChart,
   unfocusChart
   })(MainPage)
