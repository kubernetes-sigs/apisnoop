import React, { Component } from 'react'

import { NavLink, Route } from 'react-router-dom'

import Header from './Header'
import ContactListPage from '../pages/contact-list-page'
import ContactFormPage from '../pages/contact-form-page'

class App extends Component {
  render(){
    return (
      <div id='app'>
        <Header />
        <div id='nav'>
         <NavLink exact to='/'>Contacts List</NavLink>
         <NavLink exact to='/contacts/new'>Add a Contact</NavLink>
        </div>
        <Route exact path='/' component={ContactListPage} />
        <Route path='/contacts/new' component={ContactFormPage} />
        <Route path='/contacts/edit/:_id' component={ContactFormPage} />
      </div>
    )
  }
}

export default App
