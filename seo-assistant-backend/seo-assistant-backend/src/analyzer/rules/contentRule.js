const MIN_WORDS = 150

function visibleText($) {
  const clone = $('body').clone()
  clone.find('script, style, noscript').remove()
  return (clone.text() || '').replace(/\s+/g, ' ').trim()
}

// Checks: whether the page has a reasonable amount of visible text content,
// plus a light check on whether headings have supporting paragraph content.
// Intentionally basic — no semantic SEO or keyword analysis.
export function contentRule({ $ }) {
  const text = visibleText($)
  const wordCount = text ? text.split(' ').filter(Boolean).length : 0
  const headingCount = $('h1, h2, h3').length
  const paragraphCount = $('p').length
  const checks = []

  if (wordCount < MIN_WORDS) {
    checks.push({
      id: 'content-length', category: 'content', name: 'Content Length', status: 'Warning',
      value: `${wordCount} words`,
      message: 'The page has limited visible text content.',
      recommendedAction: 'Expand the page with useful, specific information related to its topic.',
      priority: {
        severity: 'LOW', title: 'Thin Page Content', optimizer: 'content',
        description: `The page has approximately ${wordCount} words of visible text.`,
        whyItMatters: 'Pages with very little content may not fully explain their topic to visitors or search engines.',
      },
    })
  } else {
    checks.push({
      id: 'content-length', category: 'content', name: 'Content Length', status: 'Passed',
      value: `${wordCount} words`,
      message: `${wordCount} words of visible text were found on the page.`,
      recommendedAction: 'No action needed.',
    })
  }

  if (headingCount > 0 && paragraphCount === 0) {
    checks.push({
      id: 'content-structure', category: 'content', name: 'Heading & Content Structure', status: 'Warning',
      value: `${headingCount} headings, 0 paragraphs`,
      message: 'The page has headings but no paragraph text was found beneath them.',
      recommendedAction: 'Add supporting paragraph content under each heading.',
    })
  } else {
    checks.push({
      id: 'content-structure', category: 'content', name: 'Heading & Content Structure', status: 'Passed',
      value: `${headingCount} heading${headingCount === 1 ? '' : 's'}, ${paragraphCount} paragraph${paragraphCount === 1 ? '' : 's'}`,
      message: 'Headings have supporting paragraph content.',
      recommendedAction: 'No action needed.',
    })
  }

  return checks
}

// Used by seoEngine to pre-fill the AI Optimizer's "original content" field —
// just the first substantial paragraph, not a full extraction.
export function extractContentSnippet($) {
  const firstParagraph = $('p').filter((_, el) => $(el).text().trim().length > 40).first().text().trim()
  if (firstParagraph) return firstParagraph.slice(0, 400)
  return visibleText($).slice(0, 400)
}
