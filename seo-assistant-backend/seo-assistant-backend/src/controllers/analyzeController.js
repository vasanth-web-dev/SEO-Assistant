import { analyzeUrl } from '../analyzer/seoEngine.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { validateAnalyzeRequest } from '../utils/validateUrl.js'

// POST /api/analyze
// Validates input, runs the fetch -> parse -> rules -> score pipeline in
// seoEngine, and returns the result. Any failure along the way (bad input,
// unreachable site, timeout, non-HTML response) becomes a clean ApiError
// that the central error middleware turns into JSON — this handler itself
// never needs a try/catch because asyncHandler forwards rejections to it.
export const postAnalyze = asyncHandler(async (req, res) => {
  const validationErrors = validateAnalyzeRequest(req.body)
  if (validationErrors.length > 0) {
    throw new ApiError(400, validationErrors[0], validationErrors)
  }

  const analysis = await analyzeUrl(req.body.url.trim())
  sendSuccess(res, { message: 'SEO analysis completed successfully', data: { analysis } })
})
