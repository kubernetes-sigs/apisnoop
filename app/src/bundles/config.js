const config = {
  gsUrl: document.querySelector('meta[name="gs-bucket"]').getAttribute('content')
}

export default {
  name: 'config',
  reducer: (state = config) => state,
  selectGsUrl: (state) => state.config.gsUrl
}
