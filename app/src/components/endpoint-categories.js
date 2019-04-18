import React from 'react'
import { connect } from 'redux-bundler-react'

const EndpointCategories = (props) => {
  const {
    endpoint
  } = props

  return (
      <div className="pa3 pa5-ns" data-name="slab-stat" id='endpoint-categories'>
        <h3>{endpoint.operationId}</h3>
        <dl className="dib mr5">
        <dd className="f6 f6-ns ml0">Level</dd>
        <dd className="f5 f4-ns b ml0 ibm-plex-mono">{endpoint.level}</dd>
        </dl>
        <dl className="dib mr5">
        <dd className="f6 f5-ns ml0">Category</dd>
        <dd className="f5 f4-ns b ml0 ibm-plex-mono">{endpoint.category}</dd>
        </dl>
        {endpoint.group.length > 0 &&
        <dl className="dib mr5">
        <dd className="f6 f5-ns ml0">Group</dd>
        <dd className="f5 f4-ns b ml0 ibm-plex-mono">{endpoint.group}</dd>
        </dl>}
        {endpoint.kind.length > 0 &&
        <dl className="dib mr5">
        <dd className="f5 f4-ns b ml0 ibm-plex-mono">{endpoint.kind}</dd>
        <dd className="f6 f5-ns ml0">Kind</dd>
        </dl>}
        <dl className="dib mr5">
        <dd className="f6 f5-ns ml0">Path</dd>
        <dd className="f5 f4-ns b ml0 ibm-plex-mono">{endpoint.path}</dd>
        </dl>
      </div>
       )
     }

export default connect(
  'selectLevelColours',
  'selectCategoryColours',
  EndpointCategories
)
