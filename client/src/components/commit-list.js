import React from 'react'

import CommitCard from './commit-card'

export default function ContactList ({commits}) {

  const commitNames = () => {
    return commits.map(commit => {
      var key_id = 'gce_commit_' + commits.indexOf(commit)
      return (
          <li key={key_id}>
          <CommitCard commit={commit} />
          </li>
      )
    })
  }
  return (
      <div>
        <ul className ='flex-row flex-wrap'>
          { commitNames() }
        </ul>
      </div>
  )
}
