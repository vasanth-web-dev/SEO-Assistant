import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlignLeft, CheckCircle2, FileText, Info, LayoutList, SlidersHorizontal, Sparkles, Type } from 'lucide-react'
import { Card, EmptyState, ErrorState, Field, LoadingState, Tabs } from '../../components/common/ui.jsx'
import SuggestionCard from '../../components/optimizer/SuggestionCard.jsx'
import ContentSuggestionCard from '../../components/optimizer/ContentSuggestionCard.jsx'
import { getAnalysis } from '../../services/analysisApi.js'
import { generate } from '../../services/aiApi.js'
import { hostOf } from '../../utils/validators.js'
import { RECOMMENDED_META_RANGE, RECOMMENDED_TITLE_RANGE } from '../../data/mockData.js'

const tabs = [['title', 'Title Optimizer', Type], ['meta', 'Meta Description Optimizer', AlignLeft], ['content', 'Content Optimizer', FileText]]

// kind -> generate() -> { status, data, error }. Params (analysis, targetKeyword)
// are passed at call time rather than baked in, so "Generate" always sends
// whatever the user has currently typed (including an edited keyword or,
// for content, edited source text).
function useGenerate(kind) {
  const [state, setState] = useState({ status: 'idle', data: null, error: '' })
  const run = async (params) => {
    setState({ status: 'loading', data: null, error: '' })
    try { setState({ status: 'done', data: await generate(kind, params), error: '' }) }
    catch (err) { setState({ status: 'error', data: null, error: err.message }) }
  }
  return [state, run]
}

function TextOptimizer({ kind, a, pill, current, currentLabel, noun, range, emptyNote }) {
  const [keyword, setKeyword] = useState(a.targetKeyword)
  const [state, run] = useGenerate(kind)
  const busy = state.status === 'loading'
  // Generate once automatically on open, using whatever keyword the analysis already had.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run({ analysis: a, targetKeyword: keyword }) }, [])
  return (
    <div className="opt">
      <Card>
        <div className="row0" style={{ paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, display: 'flex', gap: 8, alignItems: 'center' }}><SlidersHorizontal size={16} color="var(--blue)" />Page Information</h2><span className="pill">{pill}</span></div>
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="field"><label htmlFor={`site-${kind}`}>Website Context</label><select id={`site-${kind}`} defaultValue={hostOf(a.url)}><option>{hostOf(a.url)}</option></select></div>
          <div className="field"><Field id={`cur-${kind}`} label={currentLabel} hint={current ? `${current.length} chars` : ''} value={current} placeholder="None found on the page" readOnly />
            <p className="help">{current ? `Current ${noun} found on the page.` : emptyNote}</p></div>
          <div className="field"><Field id={`kw-${kind}`} label="Target Keyword" hint="Optional" value={keyword} maxLength={80} onChange={(e) => setKeyword(e.target.value)} />
            <p className="help"><Info size={13} />Add a primary keyword to make AI recommendations more relevant.</p></div>
          <button className="btn block" onClick={() => run({ analysis: a, targetKeyword: keyword })} disabled={busy}><Sparkles size={15} />Generate Suggestions</button></div>
      </Card>
      <div>
        <div className="row0" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 16, display: 'flex', gap: 8, alignItems: 'center' }}><CheckCircle2 size={17} color="var(--blue)" />SEO Guidelines</h2>
          <span className="pill">SEO Assistant recommended range: {range.join('–')} characters</span></div>
        {busy && <LoadingState text="Generating suggestions…" />}
        {state.status === 'error' && <ErrorState>{state.error}</ErrorState>}
        {state.status === 'done' && <div className="grid">
          <SuggestionCard primary noun={noun === 'title' ? 'Title' : 'Description'} range={range} {...state.data.recommended} />
          {state.data.others.length > 0 && <>
            <p className="lab" style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}><LayoutList size={14} />Other suggestions</p>
            {state.data.others.map((o, i) => <SuggestionCard key={o.text} index={i + 2} range={range} {...o} />)}</>}
        </div>}
      </div>
    </div>
  )
}

function ContentOptimizer({ a }) {
  const [state, run] = useGenerate('content')
  const [keyword, setKeyword] = useState(a.targetKeyword)
  const [original, setOriginal] = useState(a.currentContent)
  const busy = state.status === 'loading'
  return (
    <div className="opt">
      <Card><h2 style={{ fontSize: 16, paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>Page Content</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          <Field textarea id="orig" label="Original content" value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="Paste the page content you want to improve" />
          <div className="field"><Field id="kw-content" label="Target Keyword" hint="Optional" value={keyword} maxLength={80} onChange={(e) => setKeyword(e.target.value)} /></div>
          <button className="btn block" onClick={() => run({ analysis: { ...a, currentContent: original }, targetKeyword: keyword })} disabled={busy || !original.trim()}><Sparkles size={15} />{state.data ? 'Regenerate' : 'Generate'}</button></div></Card>
      <div>
        {state.status === 'idle' && <EmptyState title="No result yet">Add your content and select Generate to see recommendations.</EmptyState>}
        {busy && <LoadingState text="Analyzing content…" />}
        {state.status === 'error' && <ErrorState>{state.error}</ErrorState>}
        {state.status === 'done' && <div className="grid">
          {state.data.suggestions.map((s) => <ContentSuggestionCard key={s.title} {...s} />)}
        </div>}
      </div>
    </div>
  )
}

export default function AiOptimizer() {
  const [params, setParams] = useSearchParams()
  const [a, setA] = useState(null)
  const [error, setError] = useState(false)
  const tab = tabs.some(([id]) => id === params.get('tab')) ? params.get('tab') : 'title'
  const analysisId = params.get('analysis') || 'analysis-001'
  useEffect(() => { getAnalysis(analysisId).then((r) => (r ? setA(r) : setError(true))).catch(() => setError(true)) }, [analysisId])
  if (error) return <ErrorState>We couldn’t load the page information. Refresh to try again.</ErrorState>
  if (!a) return <LoadingState />
  return (
    <>
      <p className="eyebrow">Content &amp; Metadata Optimization</p>
      <h1 style={{ margin: '6px 0 4px' }}>AI Optimizer</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Improve your page titles, meta descriptions, and content with AI-powered suggestions.</p>
      <Tabs tabs={tabs} value={tab} onChange={(t) => setParams({ ...Object.fromEntries(params), tab: t })} />
      {tab === 'title' && <TextOptimizer key="t" kind="title" a={a} pill="Page Title" currentLabel="Current Page Title" noun="title" current={a.currentTitle} range={RECOMMENDED_TITLE_RANGE} />}
      {tab === 'meta' && <TextOptimizer key="m" kind="meta" a={a} pill="Meta Description" currentLabel="Current Meta Description" noun="description" current={a.currentMeta} range={RECOMMENDED_META_RANGE} emptyNote="No meta description was found on the page." />}
      {tab === 'content' && <ContentOptimizer key="c" a={a} />}
    </>
  )
}
