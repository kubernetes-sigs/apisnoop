const html = require('nanohtml')
const greeting = require('./greeting')
const nav = require('./nav')
const footer= require('./footer')

module.exports = (state, emit) => {
  return html`
    <body class='bg-light-yellow .black'>
    ${nav(state, emit)}
    ${greeting(state)}
    <h2>Sig Groups!</h2>
    <div>
    <ul id='sigs'>
    ${listSigsBy('name')}
    </ul>
    <div>
    ${footer(state, emit)}
    </body>
    `

  function listSigsBy (k) {
    if (!state.sigs.sigs) {
      return html`<li>loading</li>`
    }
    var sigs = state.sigs.sigs
    return sigs.map(sig => {
      return html`
        <li onmouseover=${() => activeSig(sig)} 
            onmouseout = ${() => activeSig('none')}>
        <h2>${sig[k]}</h2>
        </li>`
    })
  }

  function activeSig (sig) {
    if (sig === 'none') {
      emit('no active sig')
    }
    emit('active sig', sig)
  }

  function listActiveChairs () {
    if (!state.activeLeadership.chairs) {
      return // nothing
    }
    var chairs = state.activeLeadership.chairs
    return chairs.map(chair => {
      return html`
      <li>
        <h2>${chair.name}</h2>
        <p>Company: ${chair.company}</p>
        <p>Github: ${chair.github}</p>
      </li>
      `
    })
  }
}

//https://apisnoop.ii.coop/dist/img/apisnoop_logo_v1.png
//<div id='sig-chairs'>
//    <ul>
//    <h2>Chairs</h2>
//    ${listActiveChairs()}
//    </ul>
//    </div>

