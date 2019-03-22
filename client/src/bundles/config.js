import feathers from '@feathersjs/feathers'
import RestClient from '@feathersjs/rest-client'
import axios from 'axios'

// TODO add envify as browserify transform
const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || '/api/v1'
}

export default {
  name: 'config',
  reducer: (state = config) => state,
  getExtraArgs: store => {
    return {
      config,
      client: createClient(config)
    }
  }
}

function createClient (config) {
  const restClient = RestClient(config.backendUrl)

  return feathers()
    .configure(restClient.axios(axios))
}
