import { client } from './'

const url = '/contacts'

export function fetchContacts () {
  return dispatch => {
    dispatch({
      type: 'FETCH_CONTACTS',
      payload: client.get(url)
    })
  }
}

export function newContact () {
  return dispatch => {
    dispatch({
    type: 'NEW_CONTACT'
    })
  }
}

export function saveContact (contact) {
  return dispatch => {
    return dispatch({
      type: 'SAVE_CONTACT',
      payload: client.post(url, contact)
    })
  }
}
