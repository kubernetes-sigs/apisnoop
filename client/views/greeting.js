const html = require('nanohtml')

module.exports = (state, emit) => {
  if (!state.user.displayName) {
    return html`
      <div>
      <h1>Hello, Friend</h1>
      </div>
      `
  }

  return html`
    <div id='greeting'>
    <h1> Hello, ${state.user.displayName}</h1>
    <img class='profile-photo'  src=${state.user.photos[0].value}</img>
    </div>
    `
}
