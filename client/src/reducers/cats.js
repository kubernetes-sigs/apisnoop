function cats (state=[], action) {
  switch(action.type) {
    case 'CATS_SUCCEEDED':
      return action.cats
    case 'TEST':
      return 'test is success'
    default:
      return state
  }
}
export default cats
