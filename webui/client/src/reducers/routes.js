const initialState = {
  activeRoute: '',
  routeChange: false
}
     export default (state = initialState, action = {}) => {
       switch (action.type) {
       case 'CHANGE_ACTIVE_ROUTE':
         return {
           ...state,
           activeRoute: action.payload,
           routeChange: true
         }
       default:
         return state;
       }
     }
