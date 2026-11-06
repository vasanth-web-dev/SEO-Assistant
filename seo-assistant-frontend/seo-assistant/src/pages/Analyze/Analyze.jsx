import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, Circle, Loader2 } from 'lucide-react'
import { ErrorState, Field } from '../../components/common/ui.jsx'
import { analyzeUrl } from '../../services/analysisApi.js'
import { hostOf, isValidUrl } from '../../utils/validators.js'

const stages = ['Fetching website', 'Checking metadata', 'Analyzing content', 'Checking technical SEO', 'Generating analysis']

export default function Analyze() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [url, setUrl] = useState(state?.url ?? '')
  const [error, setError] = useState('')
  const [failed, setFailed] = useState(false)
  const [failMessage, setFailMessage] = useState('')
  const [stage, setStage] = useState(-1)
  const running = stage >= 0

  const submit = async (e) => {
    e.preventDefault()
    if (!isValidUrl(url)) return setError('Enter a valid page URL, for example https://example.com')
    setError(''); setFailed(false); setStage(0)
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, stages.length - 1)), 500)
    try { const result = await analyzeUrl(url.trim()); navigate(`/results/${result.id}`) }
    catch (err) { setFailed(true); setFailMessage(err.message); setStage(-1) }
    finally { clearInterval(timer) }
  }
  return (
    <div style={{ maxWidth: 640 }}>
      <h1>Analyze Website</h1><p className="muted" style={{ margin: '4px 0 24px' }}>Enter a public page URL to check its basic SEO.</p>
      {failed && <ErrorState>{failMessage || 'We couldn’t analyze that page. Check the URL and try again.'}</ErrorState>}
      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        <Field id="url" label="Enter a page URL" placeholder="https://example.com" value={url} error={error} disabled={running} onChange={(e) => setUrl(e.target.value)} />
        <button className="btn" type="submit" disabled={running}>Analyze Website</button>
      </form>
      {running && (
        <div className="card" style={{ marginTop: 24 }} role="status" aria-live="polite">
          <strong>Analyzing {hostOf(url)}…</strong>
          <ul className="steps">{stages.map((s, i) => (
            <li key={s} style={{ display: 'flex', gap: 8, alignItems: 'center', color: i > stage ? 'var(--muted)' : undefined }}>
              {i < stage ? <Check size={16} color="var(--grn)" /> : i === stage ? <Loader2 size={16} className="spin" /> : <Circle size={16} />}{s}</li>))}</ul>
        </div>)}
    </div>
  )
}
