// Mock, frontend-only auth for prototyping. Passwords are kept in localStorage in plain
// text purely so the demo works offline — this is NOT secure and must be replaced by a
// real backend (hashed passwords, sessions/JWT) before this ships.
import { delay } from './api.js'
const USERS_KEY = 'seo-assistant-users'
const SESSION_KEY = 'seo-assistant-session'

const readUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] } }
const writeUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u))
const toPublic = ({ password, ...rest }) => rest
const findUser = (users, email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase())

export async function register({ name, email, password }) {
  await delay(700)
  const users = readUsers()
  if (findUser(users, email)) throw new Error('An account with this email already exists.')
  const user = { name, email, password }
  users.push(user); writeUsers(users)
  localStorage.setItem(SESSION_KEY, email)
  return toPublic(user)
}

export async function login({ email, password }) {
  await delay(700)
  const user = findUser(readUsers(), email)
  if (!user || user.password !== password) throw new Error('Incorrect email or password.')
  localStorage.setItem(SESSION_KEY, email)
  return toPublic(user)
}

export async function getSession() {
  await delay(200)
  const email = localStorage.getItem(SESSION_KEY)
  if (!email) return null
  const user = findUser(readUsers(), email)
  return user ? toPublic(user) : null
}

export function endSession() { localStorage.removeItem(SESSION_KEY) }

export async function updateProfile(email, patch) {
  await delay(500)
  const users = readUsers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) throw new Error('User not found.')
  users[idx] = { ...users[idx], ...patch }
  writeUsers(users)
  if (patch.email) localStorage.setItem(SESSION_KEY, patch.email)
  return toPublic(users[idx])
}

export async function changePassword(email, currentPassword, nextPassword) {
  await delay(500)
  const users = readUsers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) throw new Error('User not found.')
  if (users[idx].password !== currentPassword) throw new Error('Current password is incorrect.')
  users[idx].password = nextPassword
  writeUsers(users)
}
