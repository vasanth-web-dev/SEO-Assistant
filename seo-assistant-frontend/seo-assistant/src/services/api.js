import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 15000 })
export default api
export const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms))
