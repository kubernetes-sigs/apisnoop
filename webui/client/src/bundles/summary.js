import { createSelector } from 'redux-bundler'

export default {
  name: 'summary',
  selectPath: createSelector(
    'selectActiveEndpoint',
    'selectQueryObject',
    'selectZoom',
    (endpoint, query, zoom) => {
      var path = {}
      if (zoom == null) {
        path = {
          level: '',
          category: '',
          name: ''
        }
      } else if (zoom !== null && query.level === undefined) {
        path = {
          level: zoom.level,
          category: zoom.category,
          name: zoom.name
        }
      } else {
        path = {
          level: query.level,
          category: query.category,
          name: query.name
        }
      }
      return path
    }
  )
}
