import axios from 'axios'

export const client = axios.create({
  baseURL: "http://localhost:3030",
  headers: {
    "Content-Type": "application/json"
  }
})
