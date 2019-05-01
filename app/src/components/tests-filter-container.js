import React from 'react'
import { connect } from 'redux-bundler-react'

import FilterContainer from './filter-container'

const TestsFilterContainer = (props) => {
  const {
    testsInput,
    namesTestsFilteredByQuery,
    testsFilteredByInput,
    doUpdateTestsInput,
  } = props

  return(
      <FilterContainer
        filter={'tests'}
        input={testsInput}
        doUpdateInput={doUpdateTestsInput}
        namesFilteredByQuery={namesTestsFilteredByQuery}
        filteredByInput={testsFilteredByInput}
      />
  )
}

export default connect(
  'selectTestsInput',
  'selectNamesTestsFilteredByQuery',
  'selectTestsFilteredByInput',
  'doUpdateTestsInput',
  TestsFilterContainer
)
