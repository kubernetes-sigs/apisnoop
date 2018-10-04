import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchConfig } from '../actions/config-actions'
import CommitList from '../components/commit-list'

class TGCommitPage extends Component {
  componentDidMount() {
    this.props.fetchConfig()
  }

  filterByBranch (arr, branchStr) {
    return arr.filter(item => {
      return item.name.includes(branchStr)
    })
  }

  render(){
    var commits = this.props.conformance
    var release = this.filterByBranch(commits, 'release')
    var dev = this.filterByBranch(commits, 'dev')
    return (
        <div>
        <h1>Commits for GCE Conformance</h1>
        <h2>Dev</h2>
        <CommitList commits={dev} />
        <h2>Release</h2>
        <CommitList commits={release} />
        </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    conformance: state.configStore.conformance
  }
}

export default connect(mapStateToProps, {fetchConfig})(TGCommitPage)
