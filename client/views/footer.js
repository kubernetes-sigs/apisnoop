const html = require('nanohtml')

module.exports = (state, emit) => {
  return html`
  <nav class="db dt-l w-100 border-box ph3 bg-black white shadow-3 ph5-l pv4">
      <a class="flex items-center v-mid mid-gray link dim w-100 tc tl-l mb2 mb0-l" href="#" title="Home">
        <img src="assets/cncf.png" class="dib w-auto" alt="cncf logo">
      </a>
      <a class="flex items-center v-mid mid-gray link dim w-100 tc tl-l mb2 mb0-l" href="#" title="Home">
        <img src="assets/packet.png" class="dib w-auto" alt="packet logo">
      </a>
      <div class="db dtc-l v-mid w-100 w-75-l tc tr-l">
        <a class="link dim dark-gray f6 f5-l dib" href="#" title="Source">Source</a>
      </div>
    </nav>
    `
}
