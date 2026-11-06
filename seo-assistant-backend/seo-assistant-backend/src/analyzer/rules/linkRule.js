// Checks: basic internal vs. external link counts. Not a backlink analysis —
// only looks at links present on the single page that was fetched.
export function linkRule({ $, url }) {
  let pageHost
  try { pageHost = new URL(url).hostname } catch { pageHost = null }

  let internal = 0
  let external = 0
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
    try {
      const resolved = new URL(href, url)
      if (pageHost && resolved.hostname === pageHost) internal += 1
      else external += 1
    } catch {
      // Unresolvable href (e.g. "javascript:void(0)") — ignore rather than crash.
    }
  })

  const checks = [{
    id: 'external-links', category: 'links', name: 'External Links', status: 'Passed',
    value: `${external} external link${external === 1 ? '' : 's'} found`,
    message: external > 0 ? `${external} external link${external === 1 ? '' : 's'} found on the page.` : 'No external links were found on the page.',
    recommendedAction: 'No action needed.',
  }]

  if (internal === 0) {
    checks.unshift({
      id: 'internal-links', category: 'links', name: 'Internal Links', status: 'Warning',
      value: '0 internal links found',
      message: 'No internal links were found on the page.',
      recommendedAction: 'Add relevant internal links to help users and search engines navigate the site.',
      priority: {
        severity: 'LOW', title: 'No Internal Links Found', optimizer: null,
        description: 'The page has no links to other pages on the same site.',
        whyItMatters: 'Internal links help search engines discover other pages and help users navigate the site.',
      },
    })
  } else {
    checks.unshift({
      id: 'internal-links', category: 'links', name: 'Internal Links', status: 'Passed',
      value: `${internal} internal link${internal === 1 ? '' : 's'} found`,
      message: `${internal} internal link${internal === 1 ? '' : 's'} found on the page.`,
      recommendedAction: 'No action needed.',
    })
  }

  return checks
}
