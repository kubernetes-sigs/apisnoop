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
    ratioUseragentsFilteredByQuery,
    ratioTestTagsFilteredByQuery,
    ratioTestsFilteredByQuery,
    useragentsFilteredByInput,
    doUpdateUseragentsInput,
  } = props

  return(
      <section id="filters" className='relative'>
      <h2 className="magic-pointer f3 mb0">Filters</h2>
      <div className='flex flex-column flex-wrap align-center justify-start relative'>

      <FilterContainer filter={'useragents'}
        input={useragentsInput}
        ratio={ratioUseragentsFilteredByQuery}
        doUpdateInput={doUpdateUseragentsInput}
        namesFilteredByQuery={namesUseragentsFilteredByQuery}
        filteredByInput={useragentsFilteredByInput}
      />

      <FilterContainer filter={'test_tags'}
        input={testTagsInput}
        ratio={ratioTestTagsFilteredByQuery}
        doUpdateInput={doUpdateTestTagsInput}
        namesFilteredByQuery={namesTestTagsFilteredByQuery}
        filteredByInput={testTagsFilteredByInput}
      />

      <FilterContainer filter={'tests'}
        input={testsInput}
        ratio={ratioTestsFilteredByQuery}
        doUpdateInput={doUpdateTestsInput}
        namesFilteredByQuery={namesTestsFilteredByQuery}
        filteredByInput={testsFilteredByInput}
      />
      </div>
      </section>
  )
}

export default connect(
  'selectTestsInput',
  'selectNamesTestsFilteredByQuery',
  'selectTestsFilteredByInput',
  'selectRatioTestsFilteredByQuery',
  'selectTestTagsInput',
  'selectNamesTestTagsFilteredByQuery',
  'selectTestTagsFilteredByInput',
  'selectRatioTestTagsFilteredByQuery',
  'selectUseragentsInput',
  'selectNamesUseragentsFilteredByQuery',
  'selectUseragentsFilteredByInput',
  'selectRatioUseragentsFilteredByQuery',
  'doUpdateTestsInput',
  'doUpdateTestTagsInput',
  'doUpdateUseragentsInput',
  FiltersContainer
)
