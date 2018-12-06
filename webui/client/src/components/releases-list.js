import React, { Component } from 'react'

function ReleaseItem (props) {
  const { release } = props

  return (
    <li className='dib'>
      <a
        className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink"
        href={getReleaseUrl(release)}
        key={release._id}
      >
        {release.name}
      </a>
    </li>
  )
}

function ReleasesList (props) {
  const { releases } = props

  if (releases == null) return null

  return (
    <div className="ph3 mt4">
      <h2 className="f6 fw6 ttu tracked">Releases</h2>
      <ul className='list'>
        {releases.map(release => {
          return <ReleaseItem release={release} />
        })}
      </ul>
    </div>
  )
}

export default ReleasesList

function getReleaseUrl (release) {
  return `/${release.name}`
}
