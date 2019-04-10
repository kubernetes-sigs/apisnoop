import { composeBundles } from 'redux-bundler'

import jobResultsMetadata from './job-results-metadata'
import endpoints from './endpoints'
import colours from './colours'
import sunburst from './sunburst'


export default composeBundles(
  colours,
  endpoints,
  jobResultsMetadata,
  sunburst
)
