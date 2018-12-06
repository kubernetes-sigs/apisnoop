import { composeBundles } from 'redux-bundler'

import config from './config'
import currentReleaseResource from './current-release-resource'
import endpointsResource from './endpoints-resource'
import releases from './releases'
import releasesIndexResource from './releases-index-resource'
import routes from './routes'
import testsResource from './tests-resource'
import url from './url'

export default composeBundles(
  config,
  currentReleaseResource,
  endpointsResource,
  releases,
  releasesIndexResource,
  routes,
  testsResource,
  url
)
