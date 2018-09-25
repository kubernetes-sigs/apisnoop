const feathers = require('@feathersjs/feathers')
const rest = require('@feathersjs/rest-client')

module.exports = (state, emitter) => {
  //we create a new feathers rest client that will mirror our server client
  const app = feathers()
  const restClient = rest()
  app.configure(restClient.fetch(window.fetch))
  // listen in on our server's sigyaml service
  const sigs = app.service('sigyaml')

  //add sigs to state, starting with empty object
  state.sigs = {}
  state.activeSig = {}
  state.activeLeadership = {}

  emitter.on('DOMContentLoaded', function () {
    //when DOM loads, run the find method on our sigs service, which
    // brings up the whole converted yaml.  add this to state and render
    sigs.find()
      .then(items => {
        state.sigs = Object.assign(state.sigs, items)
        emitter.emit('render')
      })
  })
  emitter.on('active sig', function (sig) {
    state.activeSig = Object.assign(state.activeSig, sig)
    state.activeLeadership = Object.assign(state.activeLeadership, sig.leadership)
    emitter.emit('render')
  })
  emitter.on('no active sig', function () {
    state.activeSig = {}
    state.activeLeadership = {}
    emitter.emit('render')
  })
}

// TODO
// I would like to separate the feathers client app from this store,  
// it seems like all the configuration of it could be handled in its
// own file, and then its initialized within this store.  Figure out
