import { composeBundles } from 'redux-bundler'

import colours from './colours'
import config from './config'
import endpoints from './endpoints'
import endpointsResource from './endpoints-resource'
import jobResultsMetadata from './job-results-metadata'
import sunburst from './sunburst'
import testedStats from './tested-stats'
import zoom from './zoom'

export default composeBundles(
  colours,
  config,
  endpoints,
  endpointsResource,
  jobResultsMetadata,
  sunburst,
  testedStats,
  zoom
)
