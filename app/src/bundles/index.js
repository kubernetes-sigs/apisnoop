import { composeBundles } from 'redux-bundler'

import colours from './colours'
import endpoints from './endpoints'
import jobResultsMetadata from './job-results-metadata'
import sunburst from './sunburst'
import testedStats from './tested-stats'
import zoom from './zoom'

export default composeBundles(
  colours,
  endpoints,
  jobResultsMetadata,
  sunburst,
  testedStats,
  zoom
)
