// generate() now calls the real Phase 3 backend (POST /api/ai/optimize), which
// returns { type, suggestions: [...] } — the same shape for every type. The
// reshaping below exists only so the existing title/meta UI (one highlighted
// "recommended" card + "other suggestions") keeps working unchanged: the
// backend's first suggestion becomes "recommended", the rest become "others".
// Content suggestions are returned as-is; see AiOptimizer.jsx for why that
// optimizer's UI shows a list of recommendations rather than one rewritten block.
import api from './api.js'

export async function generate(kind, { analysis, targetKeyword } = {}) {
  let data
  try {
    const res = await api.post('/ai/optimize', { type: kind, analysis, targetKeyword })
    data = res.data.data
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Could not generate AI suggestions. Try again.')
  }

  if (kind === 'content') return { suggestions: data.suggestions }

  const [recommended, ...others] = data.suggestions
  return { recommended, others }
}
