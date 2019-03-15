import React from 'react'
import { connect } from 'redux-bundler-react'

function FilterForm (props) {
  const {
    doUpdateQuery
  } = props

  return(
      <form onSubmit={handleSubmit} className='h2'>
      <label>Filter By:</label>
      <input type="text" name="search" />
      <button type="submit">Search</button>
      </form>
  )

  function handleSubmit (e) {
    e.preventDefault()
    const filterQuery = e.target[0].value
    e.target[0].value = ""
    doUpdateQuery({filter: filterQuery})
  }
}
export default connect(
  "doUpdateQuery",
  FilterForm
)
