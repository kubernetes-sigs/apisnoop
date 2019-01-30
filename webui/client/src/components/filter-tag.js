import React from 'react'
import { connect } from 'redux-bundler-react'

function FilterTag (props) {
  const {
    doUpdateQuery,
    filter
  } = props

  return(
      <div id='filter-tag'>
      <p>Filtered By:
       <span className="no-underline near-black bg-light-green inline-flex items-center ma2 tc br2 ph2">
       <span className="f6 ml3 pr2">{filter}</span>
       <button className="but-no-style dib moon-gray" onClick={handleClick}>x</button>
       </span>
       </p>
    </div>
  )
  function handleClick () {
    doUpdateQuery({})
  }
}
export default connect(
  "doUpdateQuery",
  FilterTag
)
