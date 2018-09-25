import React, { Component } from 'react'
import CatCard from './CatCard'

class CatList extends Component {
  constructor(props){
    super(props)

    this.props.actionCats()
  }

  render(){
    return(
        <ul>
        {this.props.cats.map((cat, i) => <CatCard {...this.props} key={i} cat={cat} />)}
      </ul>
    )
  }
}

export default CatList
