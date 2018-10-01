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
    default:
      return state;
    }
}
