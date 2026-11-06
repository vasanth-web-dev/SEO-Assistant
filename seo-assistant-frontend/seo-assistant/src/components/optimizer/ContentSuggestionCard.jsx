import { useState } from 'react'
import { Copy, Lightbulb } from 'lucide-react'
import { Card } from '../common/ui.jsx'

// Content optimization returns a list of recommendations (title/description/
// example), not one rewritten passage — reuses the same card/why visual
// language as SuggestionCard rather than introducing a new pattern.
export default function ContentSuggestionCard({ title, description, example }) {
  const [copied, setCopied] = useState(false)
  const copyExample = async () => {
    try { await navigator.clipboard.writeText(example); setCopied(true); setTimeout(() => setCopied(false), 1800) }
    catch { /* clipboard unavailable — silently ignore */ }
  }
  return (
    <Card style={{ padding: 20 }}>
      <p style={{ fontWeight: 600, fontSize: 16 }}>{title}</p>
      <div className="why"><Lightbulb size={15} color="var(--blue)" style={{ flex: 'none', marginTop: 2 }} /><div><b>Why this helps</b>{description}</div></div>
      {example && (
        <div className="sfoot" style={{ justifyContent: 'space-between' }}>
          <span className="small muted">{example}</span>
          <button className="btn ghost sm" onClick={copyExample}><Copy size={13} />{copied ? 'Copied' : 'Copy example'}</button>
        </div>
      )}
    </Card>
  )
}
