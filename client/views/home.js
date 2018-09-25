const loginScreen = require('./login')
const dashboard = require('./dashboard')

module.exports = view

function view (state, emit) {
  if (!state.authenticated) {
    return loginScreen()
  }
  return dashboard(state, emit)
}
