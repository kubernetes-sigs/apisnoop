import createMatcher from 'feather-route-matcher'
import MainPage from './pages/main-page'

export default createMatcher({
  '/': MainPage,
  '/:release': MainPage
})
