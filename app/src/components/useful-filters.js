import React from 'react'
import { connect } from 'redux-bundler-react'
import { startCase } from 'lodash'

const UsefulFilters = (props) => {
  const {
    queryObject,
    doUpdateQuery
  } = props

  // Different Filters
  let conformantApis = {
    showConformanceTested: "true",
    showTested: "false",
    showUntested: "false",
    zoomed: "level-stable"
  }

  const Filter = ({filter, name}) => {
    return (
        <button
      onClick={()=>doUpdateQuery({...queryObject, ...filter})}
      className='bg-transparent b--none magic-pointer f5 blue'
        >
        {startCase(name)}
      </button>
    )
  }

  return(
    <section id="useful-filters" className='relative'>
      <h2 className="magic-pointer f5 mb0 mt1 pa1 pb0">Useful Filters</h2>
      <Filter filter={conformantApis} name='all conformant apis' />
    </section>
  )
}

export default connect(
  'selectQueryObject',
  'doUpdateQuery',
  UsefulFilters
)
