import React, { Component } from 'react'
import CatList from './CatList'

class Home extends Component {
  render(){
    return(
      <div>
        <CatList {...this.props}/>
      </div>
    )
  }
}

export default Home
