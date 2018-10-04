import React, { Component } from 'react'

import { NavLink, Route } from 'react-router-dom'

import Header from './Header'
import TGCommitsPage from '../pages/tg-commits-page'
import SunburstPage from '../pages/sunburst-page'

class App extends Component {
  render(){
    return (
      <div id='app'>
        <Header />
        <div id='nav'>
          <NavLink exact to='/'>Test Group Commits</NavLink>
          <NavLink exact to='/sunburst'>Sunburst</NavLink>
        </div>
        <Route exact path='/' component={TGCommitsPage} />
        <Route exact path='/sunburst' component={SunburstPage} />
      </div>
    )
  }
}

export default App
