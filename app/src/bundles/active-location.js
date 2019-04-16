import { isEmpty } from 'lodash'
import { createSelector } from 'redux-bundler'

export default {
  name: 'colours',
  selectActiveLocation: createSelector(
    'selectQueryObject',
    'selectZoom',
    (query, zoom) => {
      let activeLocation = {
        level: '',
        category: '',
        operationId: ''
      }
      if (isEmpty(query) && zoom == null) {
        return activeLocation
      }
      if (!isEmpty(query) && query.level) {
        activeLocation.level = query.level
        activeLocation.category = query.category || ''
        activeLocation.operationId = query.operationId || ''
        return activeLocation
      }
      if (!query.level && zoom.level) {
        activeLocation.level = zoom.level
        activeLocation.category = zoom.category || ''
        activeLocation.operationId = zoom.operationId || ''
        return activeLocation
      }
      else {
        return activeLocation
      }
    }
  )
  
}

selectActiveLocation: createSelector(
  'selectQueryObject',
  'selectZoom',
  (query, zoom) => {
    let activeLocation = {
      level: '',
      category: '',
      operationId: ''
    }
    if (isEmpty(query) && zoom == null) {
      return activeLocation
    }
    if (!isEmpty(query) && query.level) {
      activeLocation.level = query.level
      activeLocation.category = query.category || ''
      activeLocation.operationId = query.operationId || ''
      return activeLocation
    }
    if (!query.level && zoom.level) {
      activeLocation.level = zoom.level
      activeLocation.category = zoom.category || ''
      activeLocation.operationId = zoom.operationId || ''
      return activeLocation
    }
    else {
      return activeLocation
    }
  }
)
