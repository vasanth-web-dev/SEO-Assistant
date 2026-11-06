export const META_RANGE = [120, 160]

// Checks: does a meta description exist, and is its length within range.
export function metaRule({ $ }) {
  const raw = ($('meta[name="description"]').attr('content') || '').trim()
  const length = raw.length

  if (!raw) {
    return [{
      id: 'meta-description', category: 'onPage', name: 'Meta Description', status: 'Error',
      value: 'Missing', rawValue: raw,
      message: 'No meta description tag was found on the page.',
      recommendedAction: 'Add a unique, relevant meta description summarizing the page.',
      priority: {
        severity: 'HIGH', title: 'Missing Meta Description', optimizer: 'meta',
        description: 'Your page does not contain a meta description.',
        whyItMatters: 'Search engines may use other page content as the search snippet.',
      },
    }]
  }

  const tooShort = length < META_RANGE[0]
  const tooLong = length > META_RANGE[1]
  if (tooShort || tooLong) {
    return [{
      id: 'meta-description', category: 'onPage', name: 'Meta Description', status: 'Warning',
      value: `${length} characters (${tooShort ? 'too short' : 'too long'})`, rawValue: raw,
      message: `Optimal meta description length is typically ${META_RANGE[0]}–${META_RANGE[1]} characters.`,
      recommendedAction: 'Consider revising the meta description to fall within the recommended character range.',
      priority: {
        severity: 'MEDIUM', optimizer: 'meta',
        title: tooShort ? 'Meta Description Below Recommended Length' : 'Meta Description Above Recommended Length',
        description: `The meta description is ${length} characters, ${tooShort ? 'shorter' : 'longer'} than the recommended ${META_RANGE[0]}–${META_RANGE[1]} range.`,
        whyItMatters: 'A description outside the recommended range may be padded by search engines or truncated in results.',
      },
    }]
  }

  return [{
    id: 'meta-description', category: 'onPage', name: 'Meta Description', status: 'Passed',
    value: `${length} characters`, rawValue: raw,
    message: 'Meta description length is within the recommended range.',
    recommendedAction: 'No action needed.',
  }]
}
