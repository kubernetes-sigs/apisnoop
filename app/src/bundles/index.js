import { composeBundles } from 'redux-bundler'
import jobResultsMetadata from './job-results-metadata'
import endpoints from './endpoints'

export default composeBundles(
  endpoints,
  jobResultsMetadata
)
