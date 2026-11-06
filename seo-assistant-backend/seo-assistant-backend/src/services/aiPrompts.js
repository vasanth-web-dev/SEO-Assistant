// Prompt construction for the three optimization types. Kept separate from
// groqService.js (which only knows how to talk to Groq) and from
// aiController.js (which only validates the request and wires things together).
const SHARED_RULES = [
  'Use ONLY the webpage information given to you below. Do not invent facts about the page, its business, or its product.',
  'Do not invent a target keyword if none was supplied — base suggestions on the page content and SEO context instead.',
  'Never claim or imply a guaranteed Google ranking, traffic increase, or click-through-rate improvement.',
  'Respond with ONLY a single valid JSON object — no markdown code fences, no commentary before or after it.',
].join('\n- ')

function pageContext(analysis) {
  const lines = [
    `Page URL: ${analysis.url || 'unknown'}`,
    `Current title tag: ${analysis.currentTitle ? `"${analysis.currentTitle}"` : 'none found on the page'}`,
    `Current meta description: ${analysis.currentMeta ? `"${analysis.currentMeta}"` : 'none found on the page'}`,
    `Sample of visible page content: ${analysis.currentContent ? `"${analysis.currentContent}"` : 'no content sample available'}`,
  ]
  if (typeof analysis.score === 'number') lines.push(`Overall SEO Assistant score: ${analysis.score}/100 (${analysis.scoreStatus || ''})`.trim())
  return lines.join('\n')
}

function keywordLine(targetKeyword) {
  return targetKeyword
    ? `Target keyword supplied by the user: "${targetKeyword}". Use it naturally where it fits; do not force it or repeat it unnaturally.`
    : 'No target keyword was supplied. Do not invent one.'
}

function issuesSummary(analysis) {
  const issues = Array.isArray(analysis.priorityIssues) ? analysis.priorityIssues.slice(0, 5) : []
  if (issues.length === 0) return 'No specific SEO issues were supplied.'
  return issues.map((i) => `- ${i.title}: ${i.recommendedAction || ''}`.trim()).join('\n')
}

function titlePrompt({ analysis, targetKeyword }) {
  const systemPrompt = `You are an SEO optimization assistant inside SEO Assistant, an SEO auditing tool.
Your job is to suggest improved HTML <title> tags for one webpage.
Rules:
- ${SHARED_RULES}
- Prefer titles between 50 and 60 characters, but prioritize clarity and relevance over hitting an exact count.
- Avoid keyword stuffing. Consider search intent, clarity, readability, and click appeal.
- Return exactly 3 suggestions, matching exactly this JSON shape:
{"type":"title","suggestions":[{"text":"...","reason":"..."},{"text":"...","reason":"..."},{"text":"...","reason":"..."}]}`

  const userPrompt = `${pageContext(analysis)}\n${keywordLine(targetKeyword)}\n\nSuggest 3 improved title tags for this page.`
  return { systemPrompt, userPrompt }
}

function metaPrompt({ analysis, targetKeyword }) {
  const systemPrompt = `You are an SEO optimization assistant inside SEO Assistant, an SEO auditing tool.
Your job is to suggest improved HTML meta descriptions for one webpage.
Rules:
- ${SHARED_RULES}
- Prefer descriptions between 120 and 160 characters, but prioritize clarity and relevance over hitting an exact count.
- Avoid keyword stuffing. Consider search intent, clarity, readability, and click appeal.
- Return exactly 3 suggestions, matching exactly this JSON shape:
{"type":"meta","suggestions":[{"text":"...","reason":"..."},{"text":"...","reason":"..."},{"text":"...","reason":"..."}]}`

  const userPrompt = `${pageContext(analysis)}\n${keywordLine(targetKeyword)}\n\nSuggest 3 improved meta descriptions for this page.`
  return { systemPrompt, userPrompt }
}

function contentPrompt({ analysis, targetKeyword }) {
  const systemPrompt = `You are an SEO optimization assistant inside SEO Assistant, an SEO auditing tool.
Your job is to give SEO content improvement RECOMMENDATIONS for one webpage — you are NOT rewriting the whole page.
Rules:
- ${SHARED_RULES}
- Consider: content clarity, search intent, heading structure, topical relevance, keyword relevance, missing useful information, readability, organization, and unnecessary repetition.
- Return between 3 and 5 suggestions, matching exactly this JSON shape:
{"type":"content","suggestions":[{"title":"short title of the improvement","description":"explanation of the improvement","example":"a short example where useful, or an empty string if not applicable"}]}`

  const userPrompt = `${pageContext(analysis)}\n${keywordLine(targetKeyword)}\n\nExisting SEO findings for this page (for context only):\n${issuesSummary(analysis)}\n\nGive 3 to 5 actionable content improvement recommendations for this page.`
  return { systemPrompt, userPrompt }
}

const BUILDERS = { title: titlePrompt, meta: metaPrompt, content: contentPrompt }

export function buildPrompt(type, { analysis, targetKeyword }) {
  return BUILDERS[type]({ analysis, targetKeyword })
}
