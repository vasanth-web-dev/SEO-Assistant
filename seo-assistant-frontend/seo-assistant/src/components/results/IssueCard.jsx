import { CircleAlert, Sparkles, TriangleAlert } from 'lucide-react'
import { Card, SeverityBadge } from '../common/ui.jsx'
export default function IssueCard({ issue, onDetails, onFix }) {
  const high = issue.severity === 'HIGH'
  const Icon = high ? CircleAlert : TriangleAlert
  return (
    <Card style={{ padding: 20 }}>
      <div className="row0"><h3 style={{ fontSize: 16, display: 'flex', gap: 8, alignItems: 'center' }}><Icon size={18} color={high ? 'var(--red)' : '#d97706'} />{issue.title}</h3><SeverityBadge level={issue.severity} /></div>
      <p className="small" style={{ marginTop: 8 }}>{issue.description}</p>
      <div className="issue-box"><p className="lab">Why it matters:</p><p>{issue.whyItMatters}</p><p className="lab b">Recommended action:</p><p>{issue.recommendedAction}</p></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn ghost sm" style={{ border: 0 }} onClick={onDetails}>View Details</button>
        {issue.optimizer && <button className="btn sm" onClick={onFix}><Sparkles size={13} />Fix with AI</button>}</div>
    </Card>
  )
}
