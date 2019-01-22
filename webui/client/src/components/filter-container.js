import React from 'react'
import { connect } from 'redux-bundler-react'

function FilterContainer (props) {
  const {
    doUpdateQuery
  } = props

  return(
      <section id="filter-container" className="">
      <button onClick={handleBatchClick}>Filter by Batch</button>
      <button onClick={handleReset}>Remove Filter</button>
      </section>
  )
  function handleBatchClick () {
    doUpdateQuery({filter: 'batch'})
  }
  function handleReset () {
    doUpdateQuery({})
  }
}
export default connect(
  "doUpdateQuery",
  FilterContainer
)
