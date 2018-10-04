import React from 'react'
import ContactCard from './contact-card'

export default function ContactList ({contacts, deleteContact}) {

  const cards = () => {
    return contacts.map(contact => {
      return (
          <ContactCard
          key={contact._id}
          contact={contact}
          deleteContact={deleteContact} />
      )
    })
  }
  return (
      <div>
        <div className ='flex-row flex-wrap'>
          { cards() }
        </div>
      </div>
  )
}
