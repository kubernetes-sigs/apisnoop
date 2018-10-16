import React, { Component } from 'react'

import { NavLink, Route } from 'react-router-dom'

import Header from './header'
import Footer from './footer'
import MainPage from '../pages/main-page.js'

class App extends Component {
  render(){
    return (
      <div id='app'>
        <Header />
        <Route exact path='/' component={MainPage} />
        <Footer />
      </div>
    )
  }
}

export default App
