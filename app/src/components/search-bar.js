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

  const filterBoxClasses = 'f6 link dim ba w-20 b--light-blue pv1 dib ml2 ph3 black bg-washed-blue magic-pointer'

  return (
      <form onSubmit={handleSubmit} className='mt3'>
      <label className='ttsc pb0 f3 flex align-center'>{searchFilter.replace('_',' ')}
      <input name='ua-filter' type='text' value={input} onChange={handleInput} placeholder='regex pattern' className={filterBoxClasses}/>
      <input type='submit' value='Search'
        className='f6 link dim bn b--near-black pv1 dib ml0 ph3 black bg-light-blue magic-pointer flex items-center justify-center'

      />
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
