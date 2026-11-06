// Deterministic, explainable scoring — no hidden weighting beyond what's documented here.
const STATUS_WEIGHT = { Passed: 100, Warning: 60, Error: 20 }

// Average of this category's check scores, rounded to the nearest whole number.
export function categoryScore(checks) {
  if (checks.length === 0) return 100
  const total = checks.reduce((sum, c) => sum + (STATUS_WEIGHT[c.status] ?? 60), 0)
  return Math.round(total / checks.length)
}

// Matches the project's intended category weighting.
export const CATEGORY_WEIGHTS = { onPage: 0.3, technical: 0.25, content: 0.2, images: 0.1, links: 0.15 }

export function overallScore(categoryScores) {
  const weighted = Object.entries(CATEGORY_WEIGHTS).reduce(
    (sum, [key, weight]) => sum + (categoryScores[key] ?? 0) * weight,
    0,
  )
  return Math.round(weighted)
}

export function scoreStatus(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  return 'Needs Work'
}

export function scoreSummary(score) {
  if (score >= 90) return 'Your website has excellent SEO fundamentals, with only minor areas to refine.'
  if (score >= 70) return 'Your website has a solid SEO foundation, with several areas that could be improved.'
  return 'Your website has several SEO issues that should be addressed to improve search visibility.'
}
