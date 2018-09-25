const choo = require('choo')
// const feathers = require('@feathersjs/feathers')
const home = require('./views/home')
const feathers = require('@feathersjs/feathers')
const auth = require('@feathersjs/authentication-client')

var app = choo()
var backend = feathers()
backend.configure(auth({strategy: 'github'}))

// See if we can bring all the feathers stuff here,
// instead of in the store/sigs.js that feels janky to me.
app.use(require('./stores/sigs'))
app.use(require('./stores/conformance'))
app.use(require('./stores/user'))
app.route('/', home)
app.mount('body')
app.use(require('choo-devtools')())

// I'll need to look up routing for that a href.  It changes the url param, but doesn't actually bring you anywhere.  BUT!  
// when you go to that url directly it does do the authentication right.
