import { composeBundles } from 'redux-bundler'

import config from './config'
import releases from './releases'
import releasesIndexResource from './releases-index-resource'
import routes from './routes'
import url from './url'

export default composeBundles(
  config,
  releases,
  releasesIndexResource,
  routes,
  url
)
