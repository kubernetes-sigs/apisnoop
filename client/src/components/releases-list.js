import React from 'react'
import { connect } from 'redux-bundler-react'


var ReleasesList = (props) => {
  const {
    releases,
    queryObject,
    grouping,
    releasesIndexShouldUpdate,
    urlObject
  } = props

  if (grouping == null) return null

  if (releasesIndexShouldUpdate) return null

  return (
      <div className="mr4">
      <h3 className="f3 mt0 ttsc tracked"> { grouping }</h3>
      <ul className='pl0 ml0'>
      {releases.map(releaseItem => {
        return <ReleaseItem release={ releaseItem } key={releaseItem._id} queryObject={queryObject}/>
      })}
    </ul>
    </div>
  )

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
          href={getReleaseUrl(release.release, queryObject)}
          title={release.version}
        >
        {release.version}
      </a>
        </li>
    )
  }
}

function getReleaseUrl (release, queryObject) {
  if (queryObject == null || queryObject.filter === undefined) {
    return `/${release}`
  }
  return `/${release}?filter=${queryObject.filter}`
}

export default connect(
  'selectQueryObject',
  'selectUrlObject',
  'selectReleasesIndexShouldUpdate',
  ReleasesList
)
