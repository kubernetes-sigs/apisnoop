import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { focusChart, unfocusChart } from '../actions/charts'
import { doChooseActiveTest } from '../actions/tests'

import {
  selectActiveRoute,
  selectActiveTest,
  selectEndpointsWithTestCoverage,
  selectFocusPathAsArray,
  selectFocusPathAsString,
  selectInteriorLabel,
  selectReleaseNamesFromEndpoints,
  selectRouteChange,
  selectIsSunburstReady,
  selectIsTestsReady,
  selectSunburstByReleaseWithSortedLevel,
  selectTestsByReleaseAndName
} from '../selectors'

import SunburstSegment from '../components/sunburst-segment'
import TestsContainer from '../components/tests-container'

class MainPage extends Component {
  render(){
    const {
      activeRoute,
      activeTest,
      doChooseActiveTest,
      focusChart,
      focusPath,
      focusPathAsString,
      interiorLabel,
      isSunburstReady,
      isTestsReady,
      routeChange,
      sunburstByRelease,
      testsByRelease
    } = this.props

    const releaseBasedOnRoute = this.props.location.pathname.replace('/','')

    return (
        <main id='main-splash' className='min-vh-100'>
        <h2>You are doing a good job.</h2>
        {isSunburstReady && <SunburstSegment
         sunburst={{
           data: routeChange ? sunburstByRelease.dataByRelease[activeRoute]
             : sunburstByRelease.dataByRelease[releaseBasedOnRoute]
         }}
         focusChart={focusChart}
         unfocusChart={this.props.unfocusChart}
         release= {activeRoute}
         focusPath={focusPath}
         focusPathAsString={focusPathAsString}
         interiorLabel={interiorLabel}
         />
        }
      {(isTestsReady && testsByRelease[activeRoute]) &&
       <div>
        <TestsContainer
          tests={testsByRelease[activeRoute]}
          activeTest={activeTest}
          chooseActiveTest={doChooseActiveTest}
        />
       </div>}
      </main>
    )
  }
}

export default connect(
  createStructuredSelector({
    activeRoute: selectActiveRoute,
    activeTest: selectActiveTest,
    endpoints: selectEndpointsWithTestCoverage,
    focusPath: selectFocusPathAsArray,
    focusPathAsString: selectFocusPathAsString,
    isSunburstReady: selectIsSunburstReady,
    isTestsReady: selectIsTestsReady,
    interiorLabel: selectInteriorLabel,
    releaseNames: selectReleaseNamesFromEndpoints,
    routeChange: selectRouteChange,
    sunburstByRelease: selectSunburstByReleaseWithSortedLevel,
    testsByRelease: selectTestsByReleaseAndName
  }),
  {doChooseActiveTest,
   focusChart,
   unfocusChart
   })(MainPage)
