import React from 'react'
import { connect } from 'redux-bundler-react'


var ReleasesList = (props) => {
  const {
    all,
    e2eOnly,
    release,
    releasesIndexShouldUpdate,
    urlObject
  } = props

  if (release == null) return null

  if (releasesIndexShouldUpdate) return null

  return (
      <div className="mt2 mr5">
      <h3 className="f3 ttsc tracked"> { release }</h3>
      <ul className='pl0 ml0'>
      {all.map(releaseItem => {
          return <ReleaseItem release={ releaseItem } />
      })}
      </ul>
      {e2eOnly && <E2EList release={ e2eOnly } />}
    </div>
  )

function E2EList (props) {
  const { release } = props
  return (
      <div>
      <ul className="pl0 ml0"><span className="ttl f4 i mr2">E2E Only</span>
        {release.map(releaseItem => <ReleaseItem release={ releaseItem}/>)}
      </ul>
      </div>
  )
}

function ReleaseItem (props) {
  const { release } = props
  var releaseUrl = getReleaseUrl(release.url)
  var classes="f6 link dim br1 ba ph3 pv2 mb2 mr2 dib mid-gray"
  if (releaseUrl === urlObject.pathname) {
    classes = classes + " bg-washed-red"
  }
  return (
      <li className='dib'>
      <a
    className={ classes }
    href={getReleaseUrl(release.url)}
    key={release._id}
      >
      {release.name}
    </a>
      </li>
  )
}
}

function getReleaseUrl (release) {
  return `/${release}`
}

export default connect(
  'selectUrlObject',
  'selectReleasesIndexShouldUpdate',
  ReleasesList
)
