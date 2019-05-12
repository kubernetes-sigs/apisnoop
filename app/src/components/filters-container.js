import React from 'react'
import { connect } from 'redux-bundler-react'

import FilterContainer from './filter-container'
import FilterResetButton from './filter-reset-button'


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
      <h2 className="magic-pointer f5 mb0 mt1 pa1 pb0">Add A Filter</h2>
      <div className='flex flex-column flex-wrap align-center justify-start relative mt0'>
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
      <FilterResetButton />
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
