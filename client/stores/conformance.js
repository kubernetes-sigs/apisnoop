module.exports = (state, emitter) => {
  state.conformance = {}
  emitter.on('DOMContentLoaded', function () {
    window.fetch('http://ii.nz:9090/api/v1/stats/endpoint_hits', {credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        state.conformance = data
        emitter.emit('render')
      })
      .catch((err) => {
        emitter.emit('error', err)
      })
  })
}
