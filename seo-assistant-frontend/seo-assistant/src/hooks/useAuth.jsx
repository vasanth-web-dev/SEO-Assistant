import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../services/authApi.js'
const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { authApi.getSession().then((u) => { setUser(u); setReady(true) }) }, [])
  const login = async (email, password) => setUser(await authApi.login({ email, password }))
  const register = async (name, email, password) => setUser(await authApi.register({ name, email, password }))
  const logout = () => { authApi.endSession(); setUser(null) }
  const updateProfile = async (patch) => setUser(await authApi.updateProfile(user.email, patch))
  const changePassword = (current, next) => authApi.changePassword(user.email, current, next)
  return <Ctx.Provider value={{ user, ready, login, register, logout, updateProfile, changePassword }}>{children}</Ctx.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx)
