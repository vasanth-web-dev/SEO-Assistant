import { useState } from 'react'
import { KeyRound, User } from 'lucide-react'
import { Card, Field } from '../../components/common/ui.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth()
  const [name, setName] = useState(user.name)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [savingPw, setSavingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState('')

  const saveProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setProfileErr('Enter your name.')
    setProfileErr(''); setSavingProfile(true)
    try { await updateProfile({ name: name.trim() }); setProfileMsg('Saved') }
    catch { setProfileErr('Could not save changes. Try again.') } finally { setSavingProfile(false) }
  }
  const savePassword = async (e) => {
    e.preventDefault()
    const er = {}
    if (!pw.current) er.current = 'Enter your current password.'
    if (pw.next.length < 8) er.next = 'Use at least 8 characters.'
    if (pw.confirm !== pw.next) er.confirm = 'Passwords do not match.'
    setPwErrors(er); setPwMsg('')
    if (Object.keys(er).length) return
    setSavingPw(true)
    try { await changePassword(pw.current, pw.next); setPw({ current: '', next: '', confirm: '' }); setPwMsg('Password updated') }
    catch (err) { setPwErrors({ current: err.message }) } finally { setSavingPw(false) }
  }
  const initial = user.name.charAt(0).toUpperCase()
  return (
    <div style={{ maxWidth: 560, display: 'grid', gap: 24 }}>
      <div><h1>Profile</h1><p className="muted">Manage your account details and security.</p></div>
      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
          <span className="avatar" style={{ width: 56, height: 56, fontSize: 20 }}>{initial}</span>
          <div><strong>{user.name}</strong><p className="muted small">{user.email}</p></div>
        </div>
        <h2 style={{ fontSize: 16, display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 16 }}><User size={16} color="var(--blue)" />Profile Information</h2>
        <form onSubmit={saveProfile} noValidate style={{ display: 'grid', gap: 16 }}>
          <Field id="p-name" label="Name" value={name} error={profileErr} onChange={(e) => { setName(e.target.value); setProfileMsg('') }} />
          <Field id="p-email" label="Email" value={user.email} readOnly />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn" type="submit" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save changes'}</button>
            {profileMsg && <span className="small muted" role="status">{profileMsg}</span>}
          </div>
        </form>
      </Card>
      <Card>
        <h2 style={{ fontSize: 16, display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 16 }}><KeyRound size={16} color="var(--blue)" />Change Password</h2>
        <form onSubmit={savePassword} noValidate style={{ display: 'grid', gap: 16 }}>
          <Field id="pw-current" label="Current Password" type="password" autoComplete="current-password" value={pw.current} error={pwErrors.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          <Field id="pw-next" label="New Password" type="password" autoComplete="new-password" value={pw.next} error={pwErrors.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          <Field id="pw-confirm" label="Confirm New Password" type="password" autoComplete="new-password" value={pw.confirm} error={pwErrors.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn" type="submit" disabled={savingPw}>{savingPw ? 'Updating…' : 'Update password'}</button>
            {pwMsg && <span className="small muted" role="status">{pwMsg}</span>}
          </div>
        </form>
      </Card>
    </div>
  )
}
