import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, BrainCircuit, Code2, Eye, FileText, Globe, Image as ImageIcon, Link2, ListChecks, Search, ShieldCheck, Sparkles, Type } from 'lucide-react'
import { isValidUrl } from '../../utils/validators.js'

const checks = [
  [Type, 'On-Page SEO', 'Titles, meta descriptions, and headings.'],
  [Code2, 'Technical SEO', 'HTTPS, canonical, robots.txt, and sitemap.'],
  [FileText, 'Content', 'Check your content structure and basic SEO signals.'],
  [ImageIcon, 'Images', 'Image alt text and image-related checks.'],
  [Link2, 'Links', 'Internal and external links.'],
  [Search, 'Indexability', 'Noindex, viewport, language, and discoverability checks.'],
]
const steps = [['Enter your website', 'Enter a page URL to start your SEO analysis.'], ['Get your SEO analysis', 'See your SEO score, important issues, and detailed checks.'], ['Fix important issues', 'Understand what needs attention and how to improve it.'], ['Improve your content', 'Use AI-powered suggestions to improve titles, descriptions, and content.']]
const benefits = [[Search, 'Simple SEO Analysis', 'Understand issues without advanced SEO knowledge.'], [BadgeCheck, 'Actionable Recommendations', 'Know what to fix and why it matters.'], [Sparkles, 'AI-Powered Optimization', 'Generate better titles, descriptions, and content.']]
const about = [[Eye, 'Understand Basic SEO', 'Get clear visibility into fundamental SEO issues without needing advanced technical knowledge.'], [ListChecks, 'Identify Practical Fixes', "Pinpoint practical, actionable steps to improve your website's performance and search visibility."], [BrainCircuit, 'Automated & AI-Powered', 'Combines reliable automated rule checks with AI recommendations to make action simple.']]

const Tile = ({ icon: Icon }) => <span className="tile sm"><Icon size={16} /></span>

export default function Landing() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    if (!isValidUrl(url)) return setError('Enter a valid URL, for example https://example.com')
    navigate('/analyze', { state: { url: url.trim() } })
  }
  return (
    <>
      <section className="hero"><div className="wrap">
        <span className="pill blu eyebrow" style={{ display: 'inline-flex', padding: '3px 12px' }}><ShieldCheck size={12} />SEO Assistant</span>
        <h1>Analyze Your Website.<br />Improve Your SEO.</h1>
        <p className="lead">Get a clear SEO audit, identify important issues, and receive AI-powered recommendations to improve your website.</p>
        <form onSubmit={submit} noValidate>
          <div className="searchbar"><Globe size={16} color="var(--muted)" aria-hidden="true" />
            <label htmlFor="hero-url" className="sr">Website URL</label>
            <input id="hero-url" type="url" placeholder="https://example.com" value={url} aria-invalid={!!error} onChange={(e) => { setUrl(e.target.value); setError('') }} />
            <button className="btn sm" type="submit">Audit Website <ArrowRight size={14} /></button></div>
          {error ? <p className="err" role="alert">{error}</p> : <p className="help" style={{ justifyContent: 'center' }}>Enter a page URL to start your SEO analysis.</p>}
        </form>
      </div></section>

      <section id="features" className="sec"><div className="wrap">
        <h2>What SEO Assistant checks</h2><p className="sub">Check the important parts of your website’s SEO and see what needs improvement.</p>
        <div className="grid g3">{checks.map(([I, t, d]) => <div className="fcard" key={t}><Tile icon={I} /><h3>{t}</h3><p className="muted small">{d}</p></div>)}</div>
      </div></section>

      <section id="how-it-works" className="sec"><div className="wrap">
        <h2>How It Works</h2><p className="sub">A straightforward workflow designed to get your pages optimized in minutes.</p>
        <ol className="grid g4" style={{ listStyle: 'none', padding: 0 }}>{steps.map(([t, d], i) => <li key={t}><span className="stepn">{i + 1}</span><h3 style={{ fontSize: 14, margin: '12px 0 4px' }}>{t}</h3><p className="muted small">{d}</p></li>)}</ol>
        <div className="grid g3" style={{ marginTop: 48 }}>{benefits.map(([I, t, d]) => <div className="fcard soft" key={t}><Tile icon={I} /><h3>{t}</h3><p className="muted small">{d}</p></div>)}</div>
      </div></section>

      <section id="about" className="sec"><div className="wrap">
        <h2>About SEO Assistant</h2><p className="sub">SEO Assistant helps website owners understand their basic SEO issues and identify practical ways to improve their pages.</p>
        <div className="grid g3">{about.map(([I, t, d]) => <div className="fcard soft" key={t}><Tile icon={I} /><h3>{t}</h3><p className="muted small">{d}</p></div>)}</div>
      </div></section>
    </>
  )
}
