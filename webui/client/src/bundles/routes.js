import MainPage from '../pages/main-page'
import NotFound from '../components/not-found'

import { createRouteBundle } from 'redux-bundler'

export default createRouteBundle({
  '/': MainPage,
  '/:releaseName': MainPage,
  '*': NotFound
})
