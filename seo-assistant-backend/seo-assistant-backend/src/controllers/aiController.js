import { requestCompletion } from '../services/groqService.js'
import { buildPrompt } from '../services/aiPrompts.js'
import { parseAiResponse } from '../services/aiResponseSchema.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { sendSuccess } from '../utils/apiResponse.js'

const SUPPORTED_TYPES = ['title', 'meta', 'content']

// The analysis object is the existing Phase 2 output (see seoEngine.js) — we
// don't re-fetch or re-analyze the page here. This is a light shape check,
// not a full schema validation: just enough to catch "missing" or "obviously
// not an analysis" before spending a Groq call on it.
function isValidAnalysis(analysis) {
  return !!analysis && typeof analysis === 'object' && typeof analysis.url === 'string' && analysis.url.trim().length > 0
}

// POST /api/ai/optimize
// Route -> Controller -> AI Service (Groq) -> structured, validated response.
// The deterministic SEO rule engine (Phase 2) remains the source of truth for
// scores and checks; Groq only ever produces optimization suggestions here.
export const postOptimize = asyncHandler(async (req, res) => {
  const { type, analysis, targetKeyword } = req.body || {}

  if (!type) throw new ApiError(400, 'A "type" field is required.')
  if (!SUPPORTED_TYPES.includes(type)) {
    throw new ApiError(400, `Unsupported type "${type}". Use one of: ${SUPPORTED_TYPES.join(', ')}.`)
  }
  if (analysis === undefined) throw new ApiError(400, 'An "analysis" object is required.')
  if (!isValidAnalysis(analysis)) {
    throw new ApiError(400, 'The provided "analysis" object is missing required page information.')
  }

  const keyword = typeof targetKeyword === 'string' ? targetKeyword.trim() : ''

  const { systemPrompt, userPrompt } = buildPrompt(type, { analysis, targetKeyword: keyword })
  const rawText = await requestCompletion({ systemPrompt, userPrompt })
  const result = parseAiResponse(type, rawText)

  sendSuccess(res, { message: 'AI suggestions generated successfully', data: result })
})
