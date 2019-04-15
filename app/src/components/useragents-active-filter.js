import React from 'react'
import {connect} from 'redux-bundler-react'

function UseragentsActiveFilter (props) {
  const useragents = props.namesUseragentsFilteredByQuery
  if(useragents == null || useragents.length <= 0) return null
  return (
      <div className='ma3'>
      <strong>Currently Filtered To:</strong>
      <ul>
      {useragents.map((useragent, index) => {
        return <li key={'useragent_'.concat(index)}>
          { useragent }
        </li>
      })
      }
    </ul>
      </div>
  )
}

export default connect(
  'selectNamesUseragentsFilteredByQuery',
  UseragentsActiveFilter
)
