import React from 'react'
import { connect } from 'redux-bundler-react'

import UseragentsSearchContainer from './useragents-search-container'
import TestsFilterContainer from './tests-filter-container'

const FiltersContainer = (props) => {
  const {
    displayFilters,
    doToggleFilters
  } = props
  return(
      <section id="filters">
      <h2 className="magic-pointer">Filters</h2>
      <div className='flex flex-row flex-wrap justify-around w-100'>
      <UseragentsSearchContainer />
      <TestsFilterContainer />
      </div>
      </section>
  )
}
export default connect(
  'selectDisplayFilters',
  'doToggleFilters',
  FiltersContainer
)
