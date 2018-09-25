const feathers = require('@feathersjs/feathers')
const rest = require('@feathersjs/rest-client')
const auth = require('@feathersjs/authentication-client')

module.exports = (state, emitter) => {
  // initialize backend connection with special  rest and auth clients.
  const app = feathers()
  const restClient = rest()

  // configure our backend client for proper authentication and API calls
  app.configure(restClient.fetch(window.fetch))
  app.configure(auth())
  const user = app.service('github')

  // set initial state.
  state.user = {}
  state.authenticated = false

  emitter.on('DOMContentLoaded', function () {
    if (window.localStorage) {
      app.authenticate()
        .then(response => console.log(response))
      user.find()
        .then(result => {
          state.user = Object.assign(state.user, result.data[0].github.profile)
          state.authenticated = true
          emitter.emit('render')
        })
    }

  })
}
