const config = {
  gsBucket: document.querySelector('meta[name="gs-bucket"]').getAttribute('content'),
  gsUrl: 'http://storage.googleapis.com/'
}

export default {
  name: 'config',
  reducer: (state = config) => state,
  selectGsPath: (state) => state.config.gsUrl.concat(state.config.gsBucket)
}
