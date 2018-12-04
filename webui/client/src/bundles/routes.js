import MainPage from '../pages/main-page'

import { createRouteBundle } from 'redux-bundler'

export default createRouteBundle({
  '/': MainPage,
  '/:releaseName': MainPage,
  '*': NotFound
})

// TODO move somewhere
function NotFound () {
  return <div>mate not found!</div>
}
