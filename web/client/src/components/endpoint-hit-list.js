import React from 'react'
import { size } from 'lodash'
import dayjs from 'dayjs'

export default function EndpointHitList({activeTest, closeActiveTest}) {
  if (size(activeTest) <= 0) return null

  return (
      <div className='pa2'>
      <h3>{activeTest.name}</h3>
      <button onClick={handleClick}>close</button>
      <ul className='list ph3 ph5-ns pv4'>{listEndpoints(activeTest.sequence)}</ul>
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
          <li key={stepKey} className='f6 f5-ns b db pa2 link dim dark-gray ba b--black-20'>
          <em>{step.timestamp}</em> - <em>{step.method}</em> - {step.level} / {step.category} / {step.endpoint}
          </li>
      )
    })
  }
  function handleClick() {
    closeActiveTest()
  }
}
