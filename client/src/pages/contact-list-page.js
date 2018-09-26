import React, { Component } from 'react'
import ContactList from '../components/contact-list'

class ContactListPage extends Component {
  render(){
    return(
        <div>
          <h1>List of Contacts</h1>
          <ContactList />
        </div>
    )
  }
}

export default ContactListPage
