import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Analyze from './pages/Analyze/Analyze.jsx'
import SeoResults from './pages/SeoResults/SeoResults.jsx'
import AiOptimizer from './pages/AiOptimizer/AiOptimizer.jsx'
import Profile from './pages/Profile/Profile.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/results/:analysisId" element={<SeoResults />} />
        <Route path="/ai-optimizer" element={<AiOptimizer />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
