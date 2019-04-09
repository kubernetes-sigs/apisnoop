import { composeBundles } from 'redux-bundler'

import jobResultsMetadata from './job-results-metadata'
import endpoints from './endpoints'
import colours from './colours'


export default composeBundles(
  colours,
  endpoints,
  jobResultsMetadata
)
