const html = require('nanohtml')

module.exports = (state, emit) => {
  return html`
  <nav class="db dt-l w-100 border-box ph3 bg-light-gray black shadow-3">
      <a class="flex items-center v-mid mid-gray link dim w-100 w-25-l tc tl-l mb2 mb0-l" href="#" title="Home">
        <img src="https://apisnoop.ii.coop/dist/img/apisnoop_logo_v1.png" class="dib w2 h2 br-100" alt="Site Name">
        <h1 class=''>APISnoop</h1>
      </a>
      <div class="db dtc-l v-mid w-100 w-75-l tc tr-l">
        <a class="link dim dark-gray f6 f5-l dib" href="#" title="Source">Source</a>
      </div>
    </nav>
    `
}
