import React from 'react'
import {connect} from 'redux-bundler-react'

function ActiveFilter (props) {
  const {results, searchFilter} = props
  if(results == null || results.length <= 0) return null
  return (
      <div className='h-100'>
      <ul className='pl0 ml0 mt0'>
      {results.map((result, index) => {
        return <li className='list f5 dib mr3 ttsc' key={`${searchFilter}`.concat(index)}>
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
