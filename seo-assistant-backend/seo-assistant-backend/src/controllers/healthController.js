import { sendSuccess } from '../utils/apiResponse.js'

// GET /api/health
// Intentionally has no dependency on MongoDB, Gemini, or the SEO analyzer —
// none of those exist yet, and this endpoint must keep working through every phase.
export function getHealth(req, res) {
  sendSuccess(res, {
    message: 'SEO Assistant API is running',
    data: { timestamp: new Date().toISOString() },
  })
}
