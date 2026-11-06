import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeCheck, BarChart3, ChevronRight, Globe, Plus, PlusCircle, Sparkles } from 'lucide-react'
import { Card, EmptyState, ErrorState, LoadingState, SeverityBadge } from '../../components/common/ui.jsx'
import StatCard from '../../components/dashboard/StatCard.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getDashboard } from '../../services/analysisApi.js'
import { formatDate, scoreTone } from '../../utils/validators.js'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => { getDashboard().then(setData).catch(() => setError(true)) }, [])
  if (error) return <ErrorState>We couldn’t load your dashboard. Refresh the page to try again.</ErrorState>
  if (!data) return <LoadingState text="Loading dashboard…" />
  const { stats, recentAnalyses, priorityIssues } = data
  return (
    <>
      <div className="head"><div>
        <p className="eyebrow"><span className="dot" />Dashboard <span className="pill">Sample Data</span></p>
        <h1 style={{ margin: '6px 0 4px' }}>Welcome back, {user.name}</h1><p className="muted">Review your recent analyses and improve your websites.</p></div>
        <button className="btn" onClick={() => navigate('/analyze')}><Plus size={16} />Analyze a Website</button></div>
      <div className="grid g3">
        <StatCard label="Total Analyses" value={stats.totalAnalyses} icon={BarChart3} />
        <StatCard label="Average SEO Score" value={stats.averageScore} unit="/ 100" icon={BadgeCheck} tone="grn" />
        <StatCard label="Websites Analyzed" value={stats.websitesAnalyzed} icon={Globe} tone="ind" /></div>
      <div className="dash">
        <Card><h2 style={{ fontSize: 18 }}>Recent Analyses</h2><p className="muted small" style={{ margin: '2px 0 16px' }}>Review your latest website audits.</p>
          {recentAnalyses.length === 0 ? <EmptyState title="No recent analyses">Analyze a website to see it here.</EmptyState> : (
            <div style={{ overflowX: 'auto' }}><table className="tbl"><thead><tr><th>Website</th><th>SEO Score</th><th>Analysis Date</th><th>Action</th></tr></thead><tbody>
              {recentAnalyses.map((r) => <tr key={r.id}>
                <td><span className="init">{r.domain.slice(0, 2).toUpperCase()}</span>{r.domain}</td>
                <td><span className={`pill ${scoreTone(r.score)}`}>● {r.score} / 100 ({r.label})</span></td>
                <td className="muted">{formatDate(r.analyzedAt)}</td>
                <td><Link to={`/results/${r.id}`} style={{ color: 'var(--blue-d)', fontWeight: 600, fontSize: 13 }}>View Results</Link></td></tr>)}</tbody></table></div>)}</Card>
        <div className="grid" style={{ gap: 24 }}>
          <Card><h2 style={{ fontSize: 18 }}>Priority Issues</h2><p className="muted small" style={{ margin: '2px 0 16px' }}>Issues that may need your attention.</p>
            {priorityIssues.map((i) => <div className="mini" key={i.id}>
              <div className="row0"><SeverityBadge level={i.severity} /><span className="muted small">{i.domain}</span></div><strong style={{ fontSize: 14 }}>{i.title}</strong>
              <div className="mini-foot"><Link to={`/results/${i.analysisId}`}>View Details</Link>
                <Link className="btn fix sm" to={`/ai-optimizer?tab=${i.optimizer}&analysis=${i.analysisId}`}><Sparkles size={13} />Fix with AI</Link></div></div>)}</Card>
          <Card><h2 style={{ fontSize: 18, marginBottom: 8 }}>Quick Actions</h2>
            <Link className="qa" to="/analyze"><PlusCircle size={18} color="var(--muted)" /><span>Analyze a Website</span><ChevronRight size={16} color="var(--muted)" /></Link>
            <Link className="qa" to="/ai-optimizer"><Sparkles size={18} color="var(--muted)" /><span>Open AI Optimizer</span><ChevronRight size={16} color="var(--muted)" /></Link></Card></div>
      </div>
    </>
  )
}
