import React, { Component } from 'react'
            import { connect } from 'react-redux'
            import { createStructuredSelector } from 'reselect'

            import { focusChart, doLockChart, unfocusChart, doUnlockChart } from '../actions/charts'
import { doChooseActiveTest, doCloseActiveTest, doSetEndpointTests } from '../actions/tests'

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
                  closeActiveTest,
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
                    <main id='main-splash' className='min-vh-80 pa4 flex'>
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
                   <div>
                    <TestsContainer
                  closeActiveTest={closeActiveTest}
                      interiorLabel={interiorLabel}
                      isTestsReady={isTestsReady}
                      chartLocked={chartLocked}
                      activeTest={activeTest}
                      chooseActiveTest={doChooseActiveTest}
                      endpointTests={endpointTests}
                    />
                   </div>
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
               closeActiveTest: doCloseActiveTest,
               focusChart,
               lockChart: doLockChart,
               setEndpointTests: doSetEndpointTests,
               unfocusChart,
               unlockChart: doUnlockChart
               })(MainPage)
