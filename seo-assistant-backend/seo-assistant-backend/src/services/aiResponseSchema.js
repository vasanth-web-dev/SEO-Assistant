import { ApiError } from '../utils/ApiError.js'

// Groq's JSON mode guarantees syntactically valid JSON, but not that it
// matches OUR schema — a model can still return the wrong keys, wrong types,
// too few items, or wrap the object in something unexpected. This module is
// the one place that trusts (or rejects) what came back.

function extractJson(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    // Fallback: the model occasionally wraps JSON in stray text despite
    // instructions not to. Try to recover the outermost { ... } block.
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start !== -1 && end > start) {
      try { return JSON.parse(raw.slice(start, end + 1)) } catch { /* fall through */ }
    }
    return null
  }
}

const clean = (v) => (typeof v === 'string' ? v.trim() : '')

// [minimum acceptable, maximum kept] suggestions per type.
const LIMITS = { title: [1, 3], meta: [1, 3], content: [1, 5] }

export function parseAiResponse(type, rawText) {
  const parsed = extractJson(rawText)
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.suggestions)) {
    throw new ApiError(502, 'AI optimization failed. Please try again.')
  }

  const normalized = type === 'content'
    ? parsed.suggestions
      .map((s) => ({ title: clean(s?.title), description: clean(s?.description), example: clean(s?.example) }))
      .filter((s) => s.title && s.description)
    : parsed.suggestions
      .map((s) => ({ text: clean(s?.text), reason: clean(s?.reason) }))
      .filter((s) => s.text && s.reason)

  const [min, max] = LIMITS[type]
  if (normalized.length < min) {
    throw new ApiError(502, 'AI optimization failed. Please try again.')
  }

  return { type, suggestions: normalized.slice(0, max) }
}
