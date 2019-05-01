import React from 'react'
import { connect } from 'redux-bundler-react'
import { pickBy } from 'lodash'

function SearchBar (props) {
  const {
    doUpdateInput,
    doUpdateQuery,
    input,
    searchFilter,
    queryObject } = props

  return (
      <form onSubmit={handleSubmit}>
      <label>by {searchFilter}:
      <input name='ua-filter' type='text' value={input} onChange={handleInput} placeholder='regex pattern' className='pa1'/>
      <input type='submit' value='submit' />
      </label>
      </form>
      )

  function handleInput (e) {
    doUpdateInput(e.target.value)
  }
  function handleSubmit (e) {
    e.preventDefault()
    let filters = {
      useragents: queryObject.useragents,
      test_tags: queryObject.test_tags,
      tests: queryObject.tests,
      bucket: queryObject.bucket
    }
    filters[searchFilter] = e.target[0].value
    filters = pickBy(filters, (v,k) => v !== '' && v !== undefined)
    doUpdateQuery({...filters})
    doUpdateInput(undefined)
  }
}

export default connect(
  'doUpdateQuery',
  'selectQueryObject',
  SearchBar
)
