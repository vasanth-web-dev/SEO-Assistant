import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
export default function PublicLayout() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [hash, pathname])
  return <div className="public"><Navbar variant="public" /><main><Outlet /></main>
    <footer className="site"><div className="wrap foot"><strong style={{ color: 'var(--text)' }}>SEO Assistant</strong><span>© 2026 SEO Assistant</span><span>Privacy Policy · Terms of Service</span></div></footer></div>
}
