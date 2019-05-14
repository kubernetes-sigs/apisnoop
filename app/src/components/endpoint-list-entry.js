import React from 'react';
import { connect } from 'redux-bundler-react'

const EndpointListEntry = (props) => {
  const {
    categoryColours,
    endpoint,
    levelColours
  } = props
  let isTested = (endpoint) => {
    if (endpoint.testHits > 0 && endpoint.conformanceHits > 0) {
      return 'Conformance Tested'
    }
    if (endpoint.testHits > 0 && endpoint.conformanceHits === 0) {
      return 'Tested'
    } else {
      return 'Untested'
    }
  }
  let testedStatus = isTested(endpoint)

  let statusColor = () => {
    let colors = {
      'Untested': 'red',
      'Tested': 'orange',
      'Conformance Tested': 'green'
    }
    return colors[testedStatus]
  }

  return (
      <tr>
      <td className="pv3 pr3 bb b--black-20">{endpoint.operationId}</td>
      <td className="pv3 pr3 bb b--black-20" style={{color: statusColor()}}>{testedStatus}</td>
      <td className="pv3 pr3 bb b--black-20" style={{color: levelColours[endpoint.level]}}>{endpoint.level}</td>
      <td className="pv3 pr3 bb b--black-20" style={{color: categoryColours['category.'+ endpoint.category]}}>{endpoint.category}</td>
      <td className="pv3 pr3 bb b--black-20">{endpoint.kind}</td>
      </tr>
  )
}

export default connect(
  'selectCategoryColours',
  'selectLevelColours',
  EndpointListEntry
)
