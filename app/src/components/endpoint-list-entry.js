import React from 'react';
import { connect } from 'redux-bundler-react';

const EndpointListEntry = (props) => {
  const {
    categoryColours,
    levelColours,
    endpoint
  } = props

  function isTested (endpoint) {
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

  let statusColor = (testedStatus) => {
    let colors = {
      'Untested': 'red',
      'Tested': 'orange',
      'Conformance Tested': 'green'
    }
    return colors[testedStatus]
  }

  return (
      <tr>
      <td class="pv3 pr3 bb b--black-20">{endpoint.operationId}</td>
      <td class="pv3 pr3 bb b--black-20"style={{color: statusColor(testedStatus)}}>{testedStatus}</td>
      <td class="pv3 pr3 bb b--black-20" style={{color: levelColours[endpoint.level]}}>{endpoint.level}</td>
      <td class="pv3 pr3 bb b--black-20" style={{color: categoryColours['category.'+endpoint.category]}}>{endpoint.category}</td>
      <td class="pv3 pr3 bb b--black-20">{endpoint.kind}</td>
      </tr>
  )
}

export default connect(
  'selectCategoryColours',
  'selectLevelColours',
  EndpointListEntry
)
