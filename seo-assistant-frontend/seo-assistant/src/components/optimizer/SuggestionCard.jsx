import { useState } from 'react'
import { Copy, Lightbulb, Pencil, Star } from 'lucide-react'
import { Card } from '../common/ui.jsx'
import { inRange } from '../../utils/validators.js'

export default function SuggestionCard({ text, reason, range, primary, index, noun }) {
  const [msg, setMsg] = useState('')
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 1800) }
  const copy = async () => { try { await navigator.clipboard.writeText(text); flash('Copied') } catch { flash('Copy failed') } }
  const ok = inRange(text.length, range)
  const count = `${text.length} characters${ok ? ` · Within recommended range${primary ? `: ${range.join('–')}` : ''}` : ''}`
  return (
    <Card className={primary ? 'hl' : ''} style={{ padding: 20 }}>
      <div className="row0" style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {primary ? <><span className="pill solid"><Star size={11} />Recommended</span><span className="lab" style={{ color: 'var(--blue-d)' }}>AI Recommendation</span></> : <span className="pill">Option {index}</span>}</div>
        <span className="small" style={{ fontWeight: 500 }}>{count}</span></div>
      {primary && <p className="muted small" style={{ marginTop: 12 }}>Recommended {noun}</p>}
      <p style={{ fontWeight: 600, fontSize: primary ? 17 : 16, margin: primary ? '2px 0 0' : '12px 0 0' }}>{text}</p>
      <div className="why"><Lightbulb size={15} color="var(--blue)" style={{ flex: 'none', marginTop: 2 }} /><div><b>Why this is better</b>{reason}</div></div>
      <div className="sfoot">
        <span className="small muted" role="status" style={{ marginRight: 'auto', alignSelf: 'center' }}>{msg}</span>
        <button className="btn ghost sm" onClick={copy}><Copy size={13} />Copy</button>
        {primary && <button className="btn sm" onClick={() => flash('Selected. Copy it into your site.')}><Pencil size={13} />Use Suggestion</button>}</div>
    </Card>
  )
}
