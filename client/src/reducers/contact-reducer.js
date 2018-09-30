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
    
    
    
    
    default:
      return state;
    }
}
