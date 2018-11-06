import React, { Component } from 'react'
   import { connect } from 'react-redux'
   import { createStructuredSelector } from 'reselect'

   import { focusChart, doLockChart, unfocusChart, doUnlockChart } from '../actions/charts'
import { doChooseActiveTest, doSetEndpointTests } from '../actions/tests'

   import {
     selectActiveRoute,
     selectActiveTest,
     selectChartLocked,
     selectEndpointTests,
     selectEndpointsWithTestCoverage,
     selectFocusPathAsArray,
     selectFocusPathAsString,
     selectInteriorLabel,
     selectReleaseNamesFromEndpoints,
     selectRouteChange,
     selectIsSunburstReady,
     selectIsTestsReady,
     selectSunburstByReleaseWithSortedLevel
   } from '../selectors'

   import SunburstSegment from '../components/sunburst-segment'
   import TestsContainer from '../components/tests-container'

   class MainPage extends Component {
     render(){
       const {
         activeRoute,
         activeTest,
         chartLocked,
         doChooseActiveTest,
         endpoints,
         endpointTests,
         focusChart,
         focusPath,
         focusPathAsString,
         interiorLabel,
         isSunburstReady,
         isTestsReady,
         lockChart,
         routeChange,
         setEndpointTests,
         sunburstByRelease,
         unfocusChart,
         unlockChart
       } = this.props

       const releaseBasedOnRoute = this.props.location.pathname.replace('/','')

       return (
           <main id='main-splash' className='min-vh-100'>
           {/* <h2>You are doing a good job.</h2> */}
           {isSunburstReady && <SunburstSegment
            sunburst={{
              data: routeChange ? sunburstByRelease.dataByRelease[activeRoute]
                : sunburstByRelease.dataByRelease[releaseBasedOnRoute]
            }}
            chartLocked={chartLocked}
            endpoints={endpoints[activeRoute]}
            focusChart={focusChart}
            unfocusChart={unfocusChart}
            lockChart={lockChart}
            unlockChart={unlockChart}
            setEndpointTests={setEndpointTests}
            release= {activeRoute}
            focusPath={focusPath}
            focusPathAsString={focusPathAsString}
            interiorLabel={interiorLabel}
            />
           }
         {(isTestsReady && endpointTests.length > 0) &&
          <div>
           <TestsContainer
             activeTest={activeTest}
             chooseActiveTest={doChooseActiveTest}
             endpointTests={endpointTests}
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
       chartLocked: selectChartLocked,
       endpoints: selectEndpointsWithTestCoverage,
       endpointTests: selectEndpointTests,
       focusPath: selectFocusPathAsArray,
       focusPathAsString: selectFocusPathAsString,
       isSunburstReady: selectIsSunburstReady,
       isTestsReady: selectIsTestsReady,
       interiorLabel: selectInteriorLabel,
       releaseNames: selectReleaseNamesFromEndpoints,
       routeChange: selectRouteChange,
       sunburstByRelease: selectSunburstByReleaseWithSortedLevel
     }),
     {doChooseActiveTest,
      focusChart,
      lockChart: doLockChart,
      setEndpointTests: doSetEndpointTests,
      unfocusChart,
      unlockChart: doUnlockChart
      })(MainPage)
