import React from 'react'

export default function ContactCard({contact, deleteContact}) {
  return (
      <article class="center mw5 mw6-ns hidden ba mv4">
      <h1 class="f4 bg-near-black white mv0 pv2 ph3">{contact.name.first} {contact.name.last}</h1>
      <div class="pa3 bt">
      <p class="f6 f5-ns lh-copy measure mv0">
        {contact.phone} ||| {contact.email}
      </p>
      <a class="f6 link dim br1 ba ph3 pv2 mb2 dib dark-green" href="#0">Edit</a>
      <a class="f6 link dim br1 ba ph3 pv2 mb2 dib dark-pink" href="#0">Delete</a>
      </div>
      </article>
  )
}
