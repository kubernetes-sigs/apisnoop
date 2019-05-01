import React from 'react'
import {connect} from 'redux-bundler-react'

function ActiveFilter (props) {
  const {results, searchFilter} = props
  if(results == null || results.length <= 0) return null
  return (
      <div className=''>
      <p className='ml0 pl0 b f5'>Currently Filtered To:</p>
      <ul className='pl0 ml0 mt0'>
      {results.map((result, index) => {
        return <li className='list f6 dib mr3 ttsc' key={`${searchFilter}`.concat(index)}>
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
