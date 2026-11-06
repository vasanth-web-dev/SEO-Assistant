import { Card } from '../common/ui.jsx'
export default function StatCard({ label, value, unit, icon: Icon, tone = '' }) {
  return <Card className="stat"><div><p className="lab">{label}</p><p style={{ marginTop: 6 }}><b>{value}</b>{unit && <span className="muted" style={{ fontSize: 16 }}> {unit}</span>}</p></div>
    <span className={`tile ${tone}`}><Icon size={18} /></span></Card>
}
