import React from 'react'
import { connect } from 'redux-bundler-react'

const EndpointCategories = (props) => {
  const {
    levelColours,
    categoryColours,
    endpoint
  } = props

  return (
      <div className="pa3 pa3-ns" data-name="slab-stat" id='endpoint-categories'>
      <h3 className='mb0 f4'>{endpoint.operationId}</h3>
      <dl className="dib mr5 mb0">
      <dd className="f6 f6-ns ml0">Level</dd>
      <dd className="f5 f4-ns ml0" style={{color: levelColours[endpoint.level]}}>
        {endpoint.level}
      </dd>
      </dl>
      <dl className="dib mr5 mb0">
      <dd className="f6 f5-ns ml0">Category</dd>
      <dd className="f5 f4-ns ml0" style={{color: categoryColours["category." + endpoint.category]}}>
      {endpoint.category}
      </dd>
      </dl>
      {endpoint.group.length > 0 &&
       <dl className="dib mr5 mb0">
       <dd className="f6 f5-ns ml0">Group</dd>
       <dd className="f5 f4-ns ml0">{endpoint.group}</dd>
       </dl>}
    {endpoint.kind.length > 0 &&
     <dl className="dib mr5 mb0">
     <dd className="f6 f5-ns ml0">Kind</dd>
     <dd className="f5 f4-ns ml0">{endpoint.kind}</dd>
     </dl>}
      <dl className="dib mr5 mb0">
      <dd className="f6 f5-ns ml0">Path</dd>
      <dd className="f5 f-ns ml0 ibm-plex-mono">{endpoint.path}</dd>
      </dl>
      </div>
       )
     }

export default connect(
  'selectLevelColours',
  'selectCategoryColours',
  EndpointCategories
)
