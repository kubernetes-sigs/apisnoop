import axios from 'axios'

export const client = axios.create({
  baseURL: "http://apisnoop.cncf.io:3030",
  headers: {
    "Content-Type": "application/json"
  }
})
