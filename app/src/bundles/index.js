import { composeBundles } from 'redux-bundler'

import activeLocation from './active-location'
import bucketList from './bucket-list'
import colours from './colours'
import config from './config'
import configResource from './config-resource'
import endpoints from './endpoints'
import endpointsResource from './endpoints-resource'
import finishedResource from './finished-resource'
import finished from './finished'
import metadataResource from './metadata-resource'
import metadata from './metadata'
import testsResource from './tests-resource'
import testTagsResource from './test-tags-resource'
import testSequencesResource from './test-sequences-resource'
import useragentsResource from './useragents-resource'
import sunburst from './sunburst'
import testedStats from './tested-stats'
import tests from './tests'
import testTags from './test-tags'
import useragents from './useragents'
import zoom from './zoom'

export default composeBundles(
  activeLocation,
  bucketList,
  colours,
  config,
  configResource,
  endpoints,
  endpointsResource,
  finished,
  finishedResource,
  metadataResource,
  metadata,
  testsResource,
  testTagsResource,
  testSequencesResource,
  useragentsResource,
  sunburst,
  testedStats,
  tests,
  testTags,
  useragents,
  zoom
)
