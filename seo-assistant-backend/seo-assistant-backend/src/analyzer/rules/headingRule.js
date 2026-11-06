// Checks: H1 presence/count, plus a light informational look at H2/H3 structure.
export function headingRule({ $ }) {
  const h1Count = $('h1').length
  const h2Count = $('h2').length
  const h3Count = $('h3').length
  const checks = []

  if (h1Count === 0) {
    checks.push({
      id: 'h1-heading', category: 'onPage', name: 'Primary Heading (H1)', status: 'Error',
      value: 'No H1 found',
      message: 'No H1 heading was found on the page.',
      recommendedAction: 'Add a single, descriptive H1 heading that reflects the page topic.',
      priority: {
        severity: 'HIGH', title: 'Missing H1 Heading', optimizer: null,
        description: 'The page has no H1 heading.',
        whyItMatters: 'The H1 heading helps both users and search engines understand the main topic of the page.',
      },
    })
  } else if (h1Count > 1) {
    checks.push({
      id: 'h1-heading', category: 'onPage', name: 'Primary Heading (H1)', status: 'Warning',
      value: `${h1Count} H1 tags found`,
      message: 'Multiple H1 tags were found; search engines generally expect a single primary heading.',
      recommendedAction: 'Use only one H1 per page, and use H2/H3 for subheadings.',
      priority: {
        severity: 'MEDIUM', title: 'Multiple H1 Tags', optimizer: null,
        description: `${h1Count} H1 tags were found on the page.`,
        whyItMatters: 'Multiple H1 tags can dilute the signal of what the page is primarily about.',
      },
    })
  } else {
    checks.push({
      id: 'h1-heading', category: 'onPage', name: 'Primary Heading (H1)', status: 'Passed',
      value: 'Single unique H1 found',
      message: 'Clean heading hierarchy with a descriptive top-level heading.',
      recommendedAction: 'No action needed.',
    })
  }

  checks.push({
    id: 'heading-structure', category: 'onPage', name: 'Heading Structure', status: 'Passed',
    value: `${h2Count} H2, ${h3Count} H3`,
    message: `The page uses ${h2Count} H2 and ${h3Count} H3 subheadings.`,
    recommendedAction: 'No action needed.',
  })

  return checks
}
