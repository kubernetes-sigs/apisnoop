const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ customizeProfile() ],
    update: [  authenticate('jwt') ],
    patch: [  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}

function customizeProfile () {
  return function (context) {
    if (context.data) {
      console.log(Object.keys(context.data.github))
      context.data.username = context.data.github.profile.username
    }
    return Promise.resolve(context)
  }
}
