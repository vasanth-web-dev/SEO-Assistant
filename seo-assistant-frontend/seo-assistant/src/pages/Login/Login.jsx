import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Field } from '../../components/common/ui.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { isValidEmail } from '../../utils/validators.js'

export default function Login() {
  const { user, ready, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [f, setF] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  if (ready && user) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!isValidEmail(f.email)) er.email = 'Enter a valid email address.'
    if (!f.password) er.password = 'Enter your password.'
    setErrors(er); setFormError('')
    if (Object.keys(er).length) return
    setBusy(true)
    try { await login(f.email.trim(), f.password); navigate(location.state?.from?.pathname || '/dashboard', { replace: true }) }
    catch (err) { setFormError(err.message) } finally { setBusy(false) }
  }
  return (
    <div className="auth">
      <h1 style={{ fontSize: 28 }}>Log in</h1>
      <p className="muted small" style={{ marginTop: 4 }}>Welcome back. Enter your details to continue.</p>
      {formError && <p className="err" role="alert" style={{ marginTop: 12 }}>{formError}</p>}
      <form onSubmit={submit} noValidate>
        <Field id="email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
        <div className="field">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" value={f.password} onChange={set('password')} aria-invalid={!!errors.password} style={{ paddingRight: 40 }} />
            <button type="button" className="icon-btn" aria-label={show ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 2, top: 2 }} onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {errors.password && <p className="err" role="alert">{errors.password}</p>}
        </div>
        <button className="btn block" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
      </form>
      <p className="muted small" style={{ marginTop: 16 }}>New here? <Link to="/register" style={{ color: 'var(--blue)' }}>Create an account</Link></p>
    </div>
  )
}
