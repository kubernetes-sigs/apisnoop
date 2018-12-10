import { composeBundles } from 'redux-bundler'

import config from './config'
import currentReleaseResource from './current-release-resource'
import endpointsResource from './endpoints-resource'
import endpoints from './endpoints'
import releases from './releases'
import releasesIndexResource from './releases-index-resource'
import routes from './routes'
import sunburst from './sunburst'
import testsResource from './tests-resource'

export default composeBundles(
  config,
  currentReleaseResource,
  endpointsResource,
  endpoints,
  releases,
  releasesIndexResource,
  routes,
  sunburst,
  testsResource
)
