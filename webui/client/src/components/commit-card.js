import React, { Component } from 'react'
import request from 'request-promise'

class ContactCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gcs_prefix: '',
      latest_build: ''
    }
    this.getLatestBuild = this.getLatestBuild.bind(this)
  }
  componentDidMount () {
    this.setState({
      latest_build: this.getLatestBuild()
    })
  }

  getLatestBuild () {
    var options = {
      url: `https://storage.googleapis.com/${this.props.test_group.gcs_prefix}/latest-build.txt`,
      headers: {
        'User-Agent': 'request'
      }
    }
    return request(options).then(response => {
      return response
    })
  }


  render(){
    return (
        <article className="center mw5 mw6-ns hidden ba mv4">
        <h1 className="f4 bg-near-black white mv0 pv2 ph3">{this.props.commit.name}</h1>
        <div className="pa3 bt">
        <p className="f6 f5-ns lh-copy measure mv0">
        {this.props.commit.description}
      </p>
        <p className="f6 f5-ns lh-copy measure mv0">
        <a href={`https://storage.googleapis.com/${this.props.test_group.gcs_prefix}/latest-build.txt`}>link to latest build</a>
      </p>
        </div>
        </article>
    )
  }
}
export default ContactCard
