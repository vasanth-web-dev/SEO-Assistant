import { Loader2 } from 'lucide-react'
export const SeverityBadge = ({ level }) => <span className={`badge ${level}`}>{level}</span>
export const StatusBadge = ({ status }) => <span className={`badge ${status}`}>{status}</span>
export const Card = ({ children, className = '', ...p }) => <div className={`card ${className}`} {...p}>{children}</div>
export const ScoreBar = ({ label, value }) => {
  const color = value >= 90 ? 'var(--grn)' : value >= 75 ? 'var(--blue)' : '#f59e0b'
  return <div><div className="row0 small" style={{ marginBottom: 6 }}><span>{label}</span><strong>{value} / 100</strong></div>
    <div className="bar" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${value}%`, background: color }} /></div></div>
}
function Field({ label, id, error, textarea, hint, ...p }) {
  const Tag = textarea ? 'textarea' : 'input'
  return <div className="field"><label htmlFor={id}><span>{label}</span>{hint && <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{hint}</span>}</label><Tag id={id} aria-invalid={!!error} {...p} />{error && <p className="err" role="alert">{error}</p>}</div>
}
export { Field }
export const LoadingState = ({ text = 'Loading…' }) => <div className="card muted" role="status"><Loader2 size={16} className="spin" style={{ verticalAlign: -3, marginRight: 8 }} />{text}</div>
export const EmptyState = ({ title, children }) => <div className="card" style={{ textAlign: 'center' }}><h3>{title}</h3><p className="muted small" style={{ marginTop: 6 }}>{children}</p></div>
export const ErrorState = ({ children }) => <div className="card" role="alert" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>{children}</div>
export const Tabs = ({ tabs, value, onChange }) => (
  <div className="tabs" role="tablist">{tabs.map(([id, label, Icon]) => <button key={id} role="tab" aria-selected={value === id} onClick={() => onChange(id)}>{Icon && <Icon size={15} />}{label}</button>)}</div>
)
