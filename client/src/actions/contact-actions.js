import { contacts } from '../contact-data.js'

export function fetchContacts () {
  return dispatch => {
    dispatch({
      type: 'FETCH_CONTACTS',
      payload: contacts
    })
  }
}
