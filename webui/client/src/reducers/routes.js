const initialState = {
  activeRoute: 'sig-release-master',
  routeChange: false
}
     export default (state = initialState, action = {}) => {
       switch (action.type) {
       case 'ACTIVE_ROUTE_CHANGED':
         return {
           ...state,
           activeRoute: action.payload,
           routeChange: true
         }
       default:
         return state;
       }
     }
