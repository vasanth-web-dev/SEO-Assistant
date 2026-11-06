// analyzeUrl() now calls the real Phase 2 backend (POST /api/analyze). Everything
// else here is still mock: the backend has no database yet, so results are kept
// in this in-memory Map (same as before) purely so /results/:analysisId and the
// AI Optimizer can look an analysis back up after analyzeUrl() returns. Dashboard
// stays on mock data until a later phase adds saved analyses.
import api from './api.js'
import { analysis, dashboard } from '../data/mockData.js'
import { delay } from './api.js'

const store = new Map([[analysis.id, analysis]])
dashboard.recentAnalyses.forEach((r) => { if (!store.has(r.id)) store.set(r.id, { ...analysis, id: r.id, url: `https://${r.domain}`, score: r.score, scoreStatus: r.label, analyzedAt: r.analyzedAt }) })

export async function analyzeUrl(url) {
  let data
  try {
    const res = await api.post('/analyze', { url })
    data = res.data.data.analysis
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Could not analyze that URL. Try again.')
  }
  const id = `analysis-${Date.now()}`
  store.set(id, { ...data, id })
  return store.get(id)
}
export async function getAnalysis(id) { await delay(400); return store.get(id) ?? null }
export async function getDashboard() { await delay(400); return dashboard }
