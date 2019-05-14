import React from 'react';

const EndpointListEntry = ({endpoint}) => {
  let isTested = () => {
    if (endpoint.testHits > 0 && endpoint.conformanceHits > 0) {
      return 'Conformance Tested'
    }
    if (endpoint.testHits > 0 && endpoint.conformanceHits === 0) {
      return 'Tested'
    } else {
      return 'Untested'
    }
  }

  return (
      <tr>
      <td class="pv3 pr3 bb b--black-20">{endpoint.operationId}</td>
      <td class="pv3 pr3 bb b--black-20">{isTested()}</td>
      <td class="pv3 pr3 bb b--black-20">{endpoint.level}</td>
      <td class="pv3 pr3 bb b--black-20">{endpoint.category}</td>
      <td class="pv3 pr3 bb b--black-20">{endpoint.kind}</td>
      </tr>
  )
}

export default EndpointListEntry
