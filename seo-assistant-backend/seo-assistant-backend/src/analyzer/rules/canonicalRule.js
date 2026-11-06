// Checks: does a canonical tag exist, and does it appear to self-reference
// this page (ignoring trailing slashes and protocol).
function normalize(u) {
  try {
    const parsed = new URL(u)
    return `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, '').toLowerCase()
  } catch {
    return null
  }
}

export function canonicalRule({ $, url }) {
  const href = $('link[rel="canonical"]').attr('href')

  if (!href) {
    return [{
      id: 'canonical-tag', category: 'technical', name: 'Canonical Tag', status: 'Warning',
      value: 'Missing',
      message: 'No canonical tag was found on the page.',
      recommendedAction: 'Add a self-referencing canonical tag to help avoid duplicate-content issues.',
      priority: {
        severity: 'LOW', title: 'Missing Canonical Tag', optimizer: null,
        description: 'The page does not declare a canonical URL.',
        whyItMatters: 'A canonical tag tells search engines which URL is the authoritative version of the page.',
      },
    }]
  }

  let resolved
  try { resolved = new URL(href, url).toString() } catch { resolved = href }
  const selfReferencing = normalize(resolved) === normalize(url)

  if (selfReferencing) {
    return [{
      id: 'canonical-tag', category: 'technical', name: 'Canonical Tag', status: 'Passed',
      value: 'Valid self-referential canonical',
      message: `Points correctly to canonical URL ${resolved}.`,
      recommendedAction: 'No action needed.',
    }]
  }

  return [{
    id: 'canonical-tag', category: 'technical', name: 'Canonical Tag', status: 'Warning',
    value: `Points to ${resolved}`,
    message: 'The canonical tag points to a different URL than the page analyzed.',
    recommendedAction: 'Confirm this is intentional; otherwise set the canonical tag to reference this page.',
    priority: {
      severity: 'LOW', title: 'Canonical Tag Points Elsewhere', optimizer: null,
      description: `The canonical tag points to ${resolved} instead of the analyzed page.`,
      whyItMatters: 'An unexpected canonical target can cause this page to be excluded from search results in favor of another URL.',
    },
  }]
}
