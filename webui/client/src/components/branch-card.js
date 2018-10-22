import React from 'react'

export default function BranchCard({statistic}) {
  console.log({statistic})
  var stat = statistic.data
  var version = (name, version) => {
    return (
      <div>
        <h3>{name}</h3>
        <p className="f6 f5-ns lh-copy measure mv0">
        {percentage(version.total, version.hit)} endpoints hit
      </p>
        <p className="f6 f5-ns lh-copy measure mv0">
        {version.total} Total
      </p>
        <p className="f6 f5-ns lh-copy measure mv0">
        {version.hit} Hit
      </p>
        </div>
    )
  }


  return(
      <li className="center mw5 mw6-ns hidden ba mv4">
      <h2 className="f4 bg-near-black white mv0 pv2 ph3">{statistic.name}</h2>
      <div className="pa3 bt">
      {version('Alpha', stat.alpha)}
      {version('Beta', stat.beta)}
      {version('Stable', stat.stable)}
      </div>
      </li>
  )
  function percentage (total, hit) {
    return ((hit / total) * 100).toFixed(2) + '%'
  }
}
