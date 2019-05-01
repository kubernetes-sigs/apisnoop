import React from 'react'
import { connect } from 'redux-bundler-react'

import UseragentsSearchContainer from './useragents-search-container'
import TestsFilterContainer from './tests-filter-container'
import FilterContainer from './filter-container'

const FiltersContainer = (props) => {
  const {
    testsInput,
    namesTestsFilteredByQuery,
    testsFilteredByInput,
    doUpdateTestsInput,
    testTagsInput,
    namesTestTagsFilteredByQuery,
    testTagsFilteredByInput,
    doUpdateTestTagsInput,
    useragentsInput,
    namesUseragentsFilteredByQuery,
    useragentsFilteredByInput,
    doUpdateUseragentsInput,
  } = props

  return(
      <section id="filters" className='vh-50 relative'>
      <h2 className="magic-pointer">Filters</h2>
      <div className='flex flex-row flex-wrap justify-around w-100 h5'>
      <FilterContainer filter={'useragents'}
        input={useragentsInput}
        doUpdateInput={doUpdateUseragentsInput}
        namesFilteredByQuery={namesUseragentsFilteredByQuery}
        filteredByInput={useragentsFilteredByInput}
      />

      <FilterContainer filter={'tests'}
        input={testsInput}
        doUpdateInput={doUpdateTestsInput}
        namesFilteredByQuery={namesTestsFilteredByQuery}
        filteredByInput={testsFilteredByInput}
      />
      <FilterContainer filter={'test_tags'}
        input={testTagsInput}
        doUpdateInput={doUpdateTestTagsInput}
        namesFilteredByQuery={namesTestTagsFilteredByQuery}
        filteredByInput={testTagsFilteredByInput}
      />
      </div>
      </section>
  )
}

export default connect(
  'selectTestsInput',
  'selectNamesTestsFilteredByQuery',
  'selectTestsFilteredByInput',
  'doUpdateTestsInput',
  'selectTestTagsInput',
  'selectNamesTestTagsFilteredByQuery',
  'selectTestTagsFilteredByInput',
  'doUpdateTestTagsInput',
  'selectUseragentsInput',
  'selectNamesUseragentsFilteredByQuery',
  'selectUseragentsFilteredByInput',
  'doUpdateUseragentsInput',
  FiltersContainer
)
