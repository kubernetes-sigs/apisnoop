import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { focusChart, unfocusChart } from '../actions/charts'
import {
  selectActiveRoute,
  selectEndpointsWithTestCoverage,
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
      endpointsWithTestCoverage,
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
           data: routeChange ? sunburstByRelease.dataByRelease[activeRoute]
             : sunburstByRelease.dataByRelease[releaseBasedOnRoute]
         }}
         endpoints={ routeChange ?
                     endpointsWithTestCoverage[activeRoute] :
                     endpointsWithTestCoverage[releaseBasedOnRoute]
                   }
         focusChart={this.props.focusChart}
         unfocusChart={this.props.unfocusChart}
         release= {activeRoute}
         focusPath={focusPath}
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
    endpointsWithTestCoverage: selectEndpointsWithTestCoverage,
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
