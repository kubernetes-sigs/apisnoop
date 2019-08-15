import { createSelector } from 'redux-bundler'

export default {
  name: 'finished',
  selectFinished: (state) => state.finishedResource.data
}
