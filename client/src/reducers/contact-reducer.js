const defaultState = {
  contacts: [],
  contact: {name:{}},
  loading: false,
  errors: {}

}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'FETCH_CONTACTS_FULFILLED': {
      return {
        ...state,
        contacts: action.payload.data.data || action.payload.data // in case pagination is disabled.
      }
    }
    case 'FETCH_CONTACT_PENDING': {
      return {
        ...state,
        loading: true,
        contact: {name:{}}
      }
    }
    case 'FETCH_CONTACT_FULFILLED': {
      return {
        ...state,
        loading: false,
        contact: action.payload.data,
        errors: {}
      }
    }
    case 'UPDATE_CONTACT_PENDING': {
      return {
        ...state,
        loading: true
      }
    }
    case 'UPDATE_CONTACT_FULFILLED': {
      const contact = action.payload.data
      return {
        ...state,
        loading: false,
        errors: {},
        contacts: state.contacts.map(item => item._id === contact._id ? contact : item)
      }
    }
    
    case 'NEW_CONTACT': {
      return {
        ...state,
        contact: {name:{}}
      }
    }
    
    case 'SAVE_CONTACT_FULFILLED': {
      return {
        ...state,
        contacts: [...state.contacts, action.payload.data],
        errors: {},
        loading: false
      }
    }
    case 'SAVE_CONTACT_REJECTED': {
      const data = action.payload.response.data
      // convert feathers error formatting to match client-side error formatting
      const { "name.first": first, "name.last": last, phone, email } = data.errors
      const errors = { global: data.message, name: {first, last}, phone, email }
      return {
        ...state,
        errors: errors,
        loading: false
      }
    }
    case 'DELETE_CONTACT_FULFILLED': {
      const _id = action.payload.data._id
      return {
        ...state,
        contacts: state.contact.filter(item => item._id !== _id)
      }
    }
    
    default:
      return state;
    }
}
