import { createSelector } from 'redux-bundler'
import { split } from 'lodash'

import { propertiesWithValue } from '../lib/utils'

export default {
  name: 'zoom',
  selectZoomArray: createSelector(
    'selectQueryObject',
    (query) => {
      if (query == null || query.zoomed === undefined) return null
      return split(query.zoomed, '-')
    }
  ),
  selectZoom: createSelector(
    'selectZoomArray',
    (zoomArray) => {
      if  (zoomArray == null) return null
      var zoomRaw = {
        depth: zoomArray[0],
        level: zoomArray[1],
        category: zoomArray[2],
        operatorId: zoomArray[3]
      }
      var zoom = propertiesWithValue(zoomRaw) || {}
      return zoom
    }
  )
}
