import React from 'react'

import CommitCard from './commit-card'

export default function CommitList ({commits, test_groups }) {

  const commitNames = () => {
    if (test_groups) {
      return commits.map(commit => {
        var key_id = 'gce_commit_' + commits.indexOf(commit)
        var test_group = getTGforCommit(commit, test_groups)
        return (
            <li key={key_id}>
            <CommitCard commit={commit} test_group={test_group} />
            </li>
        )
      })
    }
  }

  function getTGforCommit (commit, test_groups) {
    return test_groups.find(test_group => {
      return test_group.name === commit.test_group_name
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
