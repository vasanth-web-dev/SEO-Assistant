import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlignLeft, Bookmark, CalendarDays, Check, ChevronRight, Download, FileText, Info, RefreshCw, Sparkles, Type } from 'lucide-react'
import { Card, EmptyState, LoadingState, ScoreBar, StatusBadge } from '../../components/common/ui.jsx'
import IssueCard from '../../components/results/IssueCard.jsx'
import ScoreRing from '../../components/results/ScoreRing.jsx'
import { getAnalysis } from '../../services/analysisApi.js'
import { formatDate, hostOf } from '../../utils/validators.js'
import { CATEGORIES } from '../../data/mockData.js'

const valueColor = { Error: 'var(--red)', Warning: '#b45309', Passed: '#047857' }

export default function SeoResults() {
  const { analysisId } = useParams()
  const navigate = useNavigate()
  const [a, setA] = useState(undefined)
  const [tab, setTab] = useState('onPage')
  const [open, setOpen] = useState(null)
  const [note, setNote] = useState('')
  useEffect(() => { setA(undefined); getAnalysis(analysisId).then(setA) }, [analysisId])
  if (a === undefined) return <LoadingState text="Loading analysis…" />
  if (a === null) return <EmptyState title="No analysis available">We couldn’t find this analysis. <Link to="/analyze" style={{ color: 'var(--blue)' }}>Analyze a website</Link> to create one.</EmptyState>

  const soon = (what) => setNote(`${what} will be available once the backend is connected.`)
  const details = (checkId) => {
    const c = a.checks.find((x) => x.id === checkId)
    if (!c) return
    setTab(c.category); setOpen(checkId)
    setTimeout(() => document.getElementById(checkId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }
  const flagged = (k) => a.checks.filter((c) => c.category === k && c.status !== 'Passed')
  const rows = a.checks.filter((c) => c.category === tab)
  return (
    <>
      <div className="head"><div>
        <h1>SEO Analysis <span className="muted">•</span> <span style={{ color: 'var(--blue-d)' }}>{hostOf(a.url)}</span></h1>
        <p className="muted small" style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}><CalendarDays size={14} />Analyzed on {formatDate(a.analyzedAt)} • {a.checksCompleted} checks completed</p></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn sm" onClick={() => soon('Re-analysis')}><RefreshCw size={13} />Re-analyze</button>
          <button className="btn ghost sm" onClick={() => soon('Saving')}><Bookmark size={13} />Save</button>
          <button className="btn ghost sm" onClick={() => soon('Report download')}><Download size={13} />Download Report</button></div></div>
      {note && <p className="toast" role="status">{note}</p>}

      <div className="resgrid">
        <Card><div className="row0"><p className="lab">Overall SEO Score</p><span className="pill grn">{a.scoreStatus}</span></div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}><ScoreRing value={a.score} />
            <div style={{ flex: 1, minWidth: 160 }}><p className="lab">SEO Assistant Score</p><p style={{ fontSize: 24, fontWeight: 700 }}>{a.score} / 100</p><p className="muted small" style={{ marginTop: 4 }}>{a.scoreSummary}</p></div></div>
          <p className="help" style={{ borderTop: '1px solid var(--line)', paddingTop: 12, alignItems: 'flex-start' }}><Info size={14} style={{ flex: 'none', marginTop: 2 }} />Calculated by SEO Assistant based on the checks performed. This is not an official Google score.</p></Card>
        <Card><div className="row0" style={{ marginBottom: 20 }}><p className="lab">Category Scores</p><span className="muted small">{CATEGORIES.length} Categories Evaluated</span></div>
          <div className="grid" style={{ gap: 18 }}>{CATEGORIES.map(([k, l]) => <ScoreBar key={k} label={l} value={a.categoryScores[k]} />)}</div></Card>
      </div>

      <div className="row0" style={{ margin: '32px 0 12px', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 20, display: 'flex', gap: 10, alignItems: 'center' }}>Priority Issues <span className="pill red">{a.priorityIssues.length} Action Items</span></h2>
        <span className="muted small">Standardized severity ratings: HIGH • MEDIUM • LOW</span></div>
      <div className="grid g2">{a.priorityIssues.map((i) => <IssueCard key={i.id} issue={i} onDetails={() => details(i.checkId)}
        onFix={() => navigate(`/ai-optimizer?tab=${i.optimizer}&analysis=${a.id}&issue=${i.id}`)} />)}</div>

      <Card style={{ marginTop: 24, padding: '0 24px' }}>
        <div className="tabs" role="tablist" style={{ margin: 0 }}>{CATEGORIES.map(([k, l]) => { const n = flagged(k); const worst = n.some((c) => c.status === 'Error') ? 'red' : 'amb'
          return <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setOpen(null) }}>{l}
            {n.length ? <span className={`pill ${worst}`} style={{ padding: '0 6px' }}>{n.length}</span> : <Check size={13} color="var(--grn)" aria-label="No issues" />}</button> })}</div>
        <div>{rows.map((c) => (
          <div className="crow" key={c.id} id={c.id}>
            <StatusBadge status={c.status} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p><strong style={{ fontSize: 14 }}>{c.name}</strong> <span className="small" style={{ color: valueColor[c.status], marginLeft: 6 }}>{c.currentValue}</span></p>
              <p className="muted small">{c.message}</p>
              {open === c.id && <p className="small" style={{ marginTop: 8 }}><strong>Recommended action:</strong> {c.recommendedAction}</p>}</div>
            <button className="btn ghost sm" aria-expanded={open === c.id} onClick={() => setOpen(open === c.id ? null : c.id)}>View Details</button></div>))}</div>
      </Card>

      <div className="cta">
        <div><p className="lab" style={{ color: '#d1d5db', display: 'flex', gap: 6, alignItems: 'center' }}><Sparkles size={13} />AI Optimizer</p>
          <h2 style={{ marginTop: 8 }}>Improve your page titles, meta descriptions, and content with AI-powered suggestions.</h2>
          <p>Launch specialized AI-assisted optimizers directly to generate clear titles, concise meta snippets, and body copy improvements.</p></div>
        <div className="cta-btns">
          {[['title', 'Title Optimizer', Type], ['meta', 'Meta Description', AlignLeft], ['content', 'Content Optimizer', FileText]].map(([t, l, I]) =>
            <Link key={t} to={`/ai-optimizer?tab=${t}&analysis=${a.id}`}><I size={14} />{l}<ChevronRight size={14} /></Link>)}</div></div>
    </>
  )
}
