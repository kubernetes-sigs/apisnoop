import React, { Component } from 'react'
        import { connect } from 'react-redux'

  //      import { fetchConfig } from '../actions/config-actions'
 //       import CommitList from '../components/commit-list'

        class TGCommitPage extends Component {
          componentDidMount() {
//            this.props.fetchConfig()
          }

          filterByBranch (arr, branchStr) {
            return arr.filter(item => {
              return item.name.includes(branchStr)
            })
          }

          render(){
            return (
                <div>
                <h1>Commits for GCE Conformance</h1>
                <h2>Dev</h2>
                <CommitList commits={dev} test_groups={this.props.test_groups}/>
                <h2>Release</h2>
                <CommitList commits={release} test_groups={this.props.test_groups}/>
                </div>
            )
          }
        }

        function mapStateToProps (state) {
          return {
            conformance: state.configStore.conformance,
            test_groups: state.configStore.test_groups
          }
        }

        export default connect(mapStateToProps, {fetchConfig})(TGCommitPage)
