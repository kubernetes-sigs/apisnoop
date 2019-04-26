import { composeBundles } from 'redux-bundler'

import activeLocation from './active-location'
import colours from './colours'
import config from './config'
import endpoints from './endpoints'
import endpointsResource from './endpoints-resource'
import metadataResource from './metadata-resource'
import metadata from './metadata'
import testsResource from './tests-resource'
import testTagsResource from './test-tags-resource'
import testSequencesResource from './test-sequences-resource'
import useragentsResource from './useragents-resource'
import jobResultsMetadata from './job-results-metadata'
import sunburst from './sunburst'
import testedStats from './tested-stats'
import tests from './tests'
import testTags from './test-tags'
import useragents from './useragents'
import zoom from './zoom'

export default composeBundles(
  activeLocation,
  colours,
  config,
  endpoints,
  endpointsResource,
  metadataResource,
  metadata,
  testsResource,
  testTagsResource,
  testSequencesResource,
  useragentsResource,
  jobResultsMetadata,
  sunburst,
  testedStats,
  tests,
  testTags,
  useragents,
  zoom
)
