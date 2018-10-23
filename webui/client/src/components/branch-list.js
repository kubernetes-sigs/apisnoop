import React from 'react'

import BranchCard from './branch-card'

export default function BranchList ({statistics}) {
  var sortedStats = statistics.sort((a,b) => {
    return a - b
  })

  const list = () => {
    return statistics.map(statistic => {
      return(
          <BranchCard key={statistic._id} statistic={statistic}/>
      )
    })
  }

  return(
    <div>
      <ul className='list'>
      { list() }
      </ul>
    </div>
  )
}
