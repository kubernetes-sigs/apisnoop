import React from 'react'
import { connect } from 'redux-bundler-react'

import FilterTag from './filter-tag'
import FilterForm from './filter-form'

function FilterContainer (props) {
  const {
    queryObject
  } = props

  return(
      <section id="filter-container" className="mb3">
      {queryObject.filter && <FilterTag filter={queryObject.filter}/>}
      {!queryObject.filter && <FilterForm />}
      </section>
  )
}
export default connect(
  "selectQueryObject",
  FilterContainer
)
