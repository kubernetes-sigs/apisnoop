import React from 'react'
import { Link } from 'react-router-dom'

export default function ContactCard({contact, deleteContact}) {
  return (
      <article className="center mw5 mw6-ns hidden ba mv4">
      <h1 className="f4 bg-near-black white mv0 pv2 ph3">{contact.name.first} {contact.name.last}</h1>
      <div className="pa3 bt">
      <p className="f6 f5-ns lh-copy measure mv0">
        {contact.phone} ||| {contact.email}
      </p>
      <Link to={`/contacts/edit/${contact._id}`} className="f6 link dim br1 ba ph3 pv2 mb2 dib dark-green"> Edit</Link>
      <a className="f6 link dim br1 ba ph3 pv2 mb2 dib dark-pink" href="#0" onClick={()=> deleteContact(contact._id)}>Delete</a>
      </div>
      </article>
  )
}
