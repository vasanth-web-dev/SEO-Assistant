import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import { LoadingState } from '../components/common/ui.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function AppLayout() {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <div className="wrap page"><LoadingState text="Loading…" /></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <><Navbar variant="app" /><main className="wrap page"><Outlet /></main></>
}
