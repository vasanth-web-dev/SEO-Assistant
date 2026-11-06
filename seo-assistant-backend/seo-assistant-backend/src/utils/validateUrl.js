// Validates the body of a POST /api/analyze request.
// Returns an array of human-readable error strings (empty array = valid).
export function validateAnalyzeRequest(body) {
  if (!body || typeof body.url !== 'string' || body.url.trim().length === 0) {
    return ['A "url" field is required and must be a non-empty string.']
  }

  const trimmed = body.url.trim()
  let parsed
  try {
    parsed = new URL(trimmed)
  } catch {
    return ['The provided URL is not a valid URL.']
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return ['Only http:// and https:// URLs are supported.']
  }

  return []
}
