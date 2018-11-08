import React, { Component } from 'react'
   import { connect } from 'react-redux'
   import { createStructuredSelector } from 'reselect'

   import { focusChart, doLockChart, unfocusChart, doUnlockChart } from '../actions/charts'
import { doChooseActiveTest, doSetEndpointTests } from '../actions/tests'

   import {
     selectActiveTest,
     selectChartLocked,
     selectEndpointTests,
     selectEndpointsWithTestCoverage,
     selectFocusPathAsArray,
     selectFocusPathAsString,
     selectInteriorLabel,
     selectRelease,
     selectReleaseNamesFromEndpoints,
     selectIsSunburstReady,
     selectIsTestsReady,
     selectSunburstByReleaseWithSortedLevel
   } from '../selectors'

   import SunburstSegment from '../components/sunburst-segment'
   import TestsContainer from '../components/tests-container'

   class MainPage extends Component {
     render(){
       const {
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
         release,
         setEndpointTests,
         sunburstByRelease,
         unfocusChart,
         unlockChart
       } = this.props


       return (
           <main id='main-splash' className='min-vh-80'>
           {/* <h2>You are doing a good job.</h2> */}
           {isSunburstReady && <SunburstSegment
            sunburst={{data: sunburstByRelease.dataByRelease[release]}}
            chartLocked={chartLocked}
            endpoints={endpoints[release]}
            focusChart={focusChart}
            unfocusChart={unfocusChart}
            lockChart={lockChart}
            unlockChart={unlockChart}
            setEndpointTests={setEndpointTests}
            release= {release}
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
       activeTest: selectActiveTest,
       chartLocked: selectChartLocked,
       endpoints: selectEndpointsWithTestCoverage,
       endpointTests: selectEndpointTests,
       focusPath: selectFocusPathAsArray,
       focusPathAsString: selectFocusPathAsString,
       isSunburstReady: selectIsSunburstReady,
       isTestsReady: selectIsTestsReady,
       interiorLabel: selectInteriorLabel,
       release: selectRelease,
       releaseNames: selectReleaseNamesFromEndpoints,
       sunburstByRelease: selectSunburstByReleaseWithSortedLevel
     }),
     {doChooseActiveTest,
      focusChart,
      lockChart: doLockChart,
      setEndpointTests: doSetEndpointTests,
      unfocusChart,
      unlockChart: doUnlockChart
      })(MainPage)
