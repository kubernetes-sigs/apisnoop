import React from 'react'
import { connect } from 'redux-bundler-react'


var ReleasesList = (props) => {
  const {
    all,
    e2eOnly,
    release,
    urlObject
  } = props

  if (release == null) return null

  return (
      <div className="ph3 mt4 mr4">
      <h3 className="f6 fw6 ttu tracked"> { release }</h3>
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
      <ul className="pl0 ml0"> e2e Only:
        {release.map(releaseItem => <ReleaseItem release={ releaseItem}/>)}
      </ul>
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
  ReleasesList
)
