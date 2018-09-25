function cats (state=[], action) {
  switch(action.type) {
    case 'CATS_SUCCEEDED':
      return action.cats
    default:
      return state
  }
}
export default cats
