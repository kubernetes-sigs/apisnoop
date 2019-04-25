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
      <input name='ua-filter' type='text' value={input} onChange={handleInput}/>
      <input type='submit' value='submit' />
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
      tests_filter: queryObject.tests_filter,
      bucket: queryObject.bucket
    }
    filters[searchFilter] = e.target[0].value
    filters = pickBy(filters, (v,k) => v !== '' && v !== undefined)
    doUpdateQuery({...filters})
    doUpdateInput('')
  }
}

export default connect(
  'doUpdateQuery',
  'selectQueryObject',
  SearchBar
)
