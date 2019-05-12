import React from 'react'
import { connect } from 'redux-bundler-react'

function FilterResetButton (props) {
  const {
    doUpdateQuery,
    activeBucketJob,
    bucketJobPaths
  } = props

  const filterContainerClasses = 'relative mb2 pa1 mt0'
  const unsetFilterClasses = 'f6 link w-100 dim bw-20 bn pv1 dib ml0 ph3 washed-blue bg-light-red magic-pointer'

  return (
    <div className={filterContainerClasses}>
      <p className='ttsc pt0 pb0 mb2 f6'>reset all filters</p>
      <button className={unsetFilterClasses} onClick={handleClick}>Reset All</button>
    </div>
  )
  function handleClick () {
    let bucket = bucketJobPaths[activeBucketJob]
    doUpdateQuery({ bucket })
  }
}

export default connect(
  'doUpdateQuery',
  'selectActiveBucketJob',
  'selectBucketJobPaths',
  FilterResetButton
)
