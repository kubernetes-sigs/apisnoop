import jobResultsMetadata from '../data/job-results-metadata.json'

export default {
  name: 'jobResultsMetadata',
   getReducer: () => {
  const initialState = jobResultsMetadata
     return (state=initialState, action) => {
       return state
     }
   },
  selectMetadata: (state) => state.jobResultsMetadata
}
