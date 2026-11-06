import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Field } from '../../components/common/ui.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { isValidEmail } from '../../utils/validators.js'

export default function Register() {
  const { user, ready, register } = useAuth()
  const navigate = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  if (ready && user) return <Navigate to="/dashboard" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Enter your name.'
    if (!isValidEmail(f.email)) er.email = 'Enter a valid email address.'
    if (f.password.length < 8) er.password = 'Use at least 8 characters.'
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.'
    if (!agree) er.agree = 'Accept the terms to continue.'
    setErrors(er); setFormError('')
    if (Object.keys(er).length) return
    setBusy(true)
    try { await register(f.name.trim(), f.email.trim(), f.password); navigate('/dashboard', { replace: true }) }
    catch (err) { setFormError(err.message) } finally { setBusy(false) }
  }
  return (
    <div className="auth">
      <h1 style={{ fontSize: 28 }}>Create your account</h1>
      <p className="muted small" style={{ marginTop: 4 }}>Start analyzing your websites in minutes.</p>
      {formError && <p className="err" role="alert" style={{ marginTop: 12 }}>{formError}</p>}
      <form onSubmit={submit} noValidate>
        <Field id="name" label="Name" autoComplete="name" value={f.name} onChange={set('name')} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
        <div className="field">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" value={f.password} onChange={set('password')} aria-invalid={!!errors.password} style={{ paddingRight: 40 }} />
            <button type="button" className="icon-btn" aria-label={show ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 2, top: 2 }} onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {errors.password && <p className="err" role="alert">{errors.password}</p>}
        </div>
        <Field id="confirm" label="Confirm Password" type={show ? 'text' : 'password'} autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={errors.confirm} />
        <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>
        {errors.agree && <p className="err" role="alert">{errors.agree}</p>}
        <button className="btn block" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create Account'}</button>
      </form>
      <p className="muted small" style={{ marginTop: 16 }}>Already have an account? <Link to="/login" style={{ color: 'var(--blue)' }}>Login</Link></p>
    </div>
  )
}
