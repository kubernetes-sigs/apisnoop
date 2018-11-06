import React from 'react'
import { size } from 'lodash'

export default function EndpointHitList({test}) {

  if(size(test) <= 0) {
    return (
        <div>
        <h2>Click Test to see Endpoints Hit</h2>
        </div>
    )
  }

  return (
      <div>
      <h2>Endpoints Hit</h2>
      <p>For</p>
      <h3>{test.name}</h3>
      <ul>{listEndpoints(test.sequence)}</ul>
      </div>
  )

  function listEndpoints (sequence) {
    return sequence.map(data => {
      var step = {
        timestamp: data[0],
        level: data[1],
        category: data[2],
        method: data[3],
        endpoint: data[4]
      }
      return(
          <li>
          <strong>{step.timestamp}</strong>
          <p>{step.level} / {step.category} / {step.method} / {step.endpoint} </p>
          </li>
      )
    })
  }
}
