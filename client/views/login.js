const html = require('nanohtml')

module.exports = view

function view () {
  return html`
    <body>
    <h1> 
    <a href='/auth/github' title='authorize app with github' onclick=${login}>Log Into Github</a>
    </h1>
    </body>
    `
  // choo wants explicit routes.  It expects /auth/github to be a view i've set up.  But I need it
  // to instead query my api located at /auth/github.  So I have to explicitly set the location to
  // that url.  If there's a better way, I will change it to that!
  function login (e) {
    e.preventDefault()
    location = '/auth/github'
  }
}
