import { ApiError } from '../../utils/ApiError.js'

const TIMEOUT_MS = 10000
const USER_AGENT = 'SEOAssistantBot/0.1 (+https://seo-assistant.example; educational project, Phase 2)'

// Fetches a single page's HTML. Does not crawl the rest of the site, does not
// retry, and does not attempt to validate robots.txt or sitemaps — this layer's
// only job is "get the HTML for this one URL, safely, or fail clearly."
export async function fetchPageHtml(targetUrl) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response

  try {
    response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: 'follow', // follow normal redirects (fetch caps this at 20 hops)
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(504, 'The request to that website timed out.')
    }
    // DNS failures, connection refused, TLS errors, etc. all land here.
    throw new ApiError(502, 'Could not reach the provided URL. Check that it is correct and publicly accessible.')
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new ApiError(502, `The website responded with HTTP ${response.status}, so it could not be analyzed.`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    throw new ApiError(422, 'The URL did not return an HTML page, so it could not be analyzed.')
  }

  const html = await response.text()
  if (!html || html.trim().length === 0) {
    throw new ApiError(422, 'The page returned no content to analyze.')
  }

  // response.url reflects the final address after any redirects, which matters
  // for resolving relative links and checking a self-referencing canonical tag.
  return { html, finalUrl: response.url || targetUrl }
}
