import axios from 'axios'

// TODO add envify as browserify transform
const config = {
  backendUrl: process.env.BACKEND_URL
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
  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      "Content-Type": "application/json"
    }
  })
}
