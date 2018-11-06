import React from 'react'
import { size } from 'lodash'
import dayjs from 'dayjs'

export default function EndpointHitList({activeTest}) {
  if (size(activeTest) <= 0) return null

  return (
      <div className='pa2'>
      <h3>{activeTest.name}</h3>
      <ul className='list'>{listEndpoints(activeTest.sequence)}</ul>
      </div>
  )

  function listEndpoints (sequence) {
    return sequence.map(data => {
      var step = {
        timestamp: dayjs(data[0]).format('HH:mm:ss'),
        level: data[1],
        category: data[2],
        method: data[3],
        endpoint: data[4]
      }
      var stepKey = `${sequence.indexOf(data)}_${step.timestamp}`
      return(
          <li key={stepKey} className='tl'>
          <p>{step.level} / {step.category} / {step.method} / {step.endpoint} <em>{step.timestamp}</em></p>
          </li>
      )
    })
  }
}
