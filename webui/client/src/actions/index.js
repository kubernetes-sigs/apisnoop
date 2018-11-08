import axios from 'axios'

export const client = axios.create({
  baseURL: "https://feathers.apisnoop.cncf.ci",
  headers: {
    "Content-Type": "application/json"
  }
})
