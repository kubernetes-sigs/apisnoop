import React from 'react'
import {connect} from 'redux-bundler-react'

function ActiveFilter (props) {
  const {results, searchFilter} = props
  if(results == null || results.length <= 0) return null
  return (
      <div className='ma3'>
      <strong>Currently Filtered To:</strong>
      <ul>
      {results.map((result, index) => {
        return <li key={`${searchFilter}`.concat(index)}>
          { result }
        </li>
      })
      }
    </ul>
      </div>
  )
}

export default connect(
  ActiveFilter
)
