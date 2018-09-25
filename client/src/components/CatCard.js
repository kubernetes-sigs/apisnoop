import React, { Component } from 'react'

class CatCard extends Component {
  render(){
    const { cat } = this.props
    return (
        <li>
          <h2>{cat.name}</h2>
          <em>{cat.catchphrase}</em>
        </li>
    )
  }
}

  export default CatCard
