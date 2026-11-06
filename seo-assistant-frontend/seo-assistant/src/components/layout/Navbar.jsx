import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'

const publicLinks = [['Features', 'features'], ['How It Works', 'how-it-works'], ['About', 'about']]
const appLinks = [['Dashboard', '/dashboard', ['/dashboard']], ['Analyze', '/analyze', ['/analyze', '/results']], ['AI Optimizer', '/ai-optimizer', ['/ai-optimizer']]]

export const Logo = ({ to }) => <Link to={to} className="logo"><span className="logo-mark" aria-hidden="true">A</span>SEO Assistant</Link>

export default function Navbar({ variant }) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const isApp = variant === 'app'
  const close = () => { setOpen(false); setMenu(false) }
  const doLogout = () => { close(); logout(); navigate('/') }
  const isOn = (prefixes) => prefixes.some((p) => pathname.startsWith(p))
  const items = isApp
    ? appLinks.map(([l, to, m]) => <Link key={to} to={to} onClick={close} className={isOn(m) ? 'active' : ''} aria-current={isOn(m) ? 'page' : undefined}>{l}</Link>)
    : publicLinks.map(([l, id]) => <Link key={id} to={`/#${id}`} onClick={close} className={hash === `#${id}` ? 'active' : ''}>{l}</Link>)
  const initial = (user?.name || 'U').charAt(0).toUpperCase()
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Logo to={isApp ? '/dashboard' : '/'} />
        <nav className={`links ${isApp ? '' : 'plain'}`} aria-label="Main">{items}</nav>
        <div className="actions">
          {isApp ? <>
            <button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button>
            <button className="user-btn" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <span className="avatar">{initial}</span>{user?.name}<ChevronDown size={14} /></button>
            {menu && <div className="menu" role="menu"><Link to="/profile" onClick={close} role="menuitem">Profile</Link><button onClick={doLogout} role="menuitem">Logout</button></div>}
          </> : <><Link to="/login" className="small" style={{ fontWeight: 500 }}>Login</Link><Link to="/register" className="btn sm">Get Started</Link></>}
        </div>
        <button className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <nav className={`mobile ${open ? 'open' : ''}`} aria-label="Mobile">
        {items}
        {isApp ? <><Link to="/profile" onClick={close}>Profile</Link><button onClick={doLogout}>Logout</button></>
          : <><Link to="/login" onClick={close}>Login</Link><Link to="/register" onClick={close}>Get Started</Link></>}
      </nav>
    </header>
  )
}
