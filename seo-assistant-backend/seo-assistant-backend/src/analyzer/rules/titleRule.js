export const TITLE_RANGE = [50, 60]

// Checks: does a <title> tag exist, and is its length within SEO Assistant's
// recommended range. Does not claim any specific length guarantees ranking.
export function titleRule({ $ }) {
  const raw = ($('title').first().text() || '').trim()
  const length = raw.length

  if (!raw) {
    return [{
      id: 'title', category: 'onPage', name: 'Title Tag', status: 'Error',
      value: 'Missing', rawValue: raw,
      message: 'No <title> tag was found on the page.',
      recommendedAction: 'Add a descriptive <title> tag to the page.',
      priority: {
        severity: 'HIGH', title: 'Missing Title Tag', optimizer: 'title',
        description: 'The page does not have a title tag.',
        whyItMatters: 'Search engines and browser tabs rely on the title tag to identify and describe the page.',
      },
    }]
  }

  const tooShort = length < TITLE_RANGE[0]
  const tooLong = length > TITLE_RANGE[1]
  if (tooShort || tooLong) {
    return [{
      id: 'title', category: 'onPage', name: 'Title Tag', status: 'Warning',
      value: `${length} characters (${tooShort ? 'too short' : 'too long'})`, rawValue: raw,
      message: `Optimal title length recommended for desktop and mobile SERPs is ${TITLE_RANGE[0]}–${TITLE_RANGE[1]} characters.`,
      recommendedAction: 'Consider revising the title to fall within the recommended character range.',
      priority: {
        severity: 'MEDIUM', optimizer: 'title',
        title: tooShort ? 'Title Below Recommended Length' : 'Title Above Recommended Length',
        description: `The title is ${length} characters, ${tooShort ? 'shorter' : 'longer'} than the recommended ${TITLE_RANGE[0]}–${TITLE_RANGE[1]} range.`,
        whyItMatters: "Titles outside SEO Assistant's recommended range may be truncated in search results or fail to fully describe the page.",
      },
    }]
  }

  return [{
    id: 'title', category: 'onPage', name: 'Title Tag', status: 'Passed',
    value: `${length} characters`, rawValue: raw,
    message: 'Title length is within the recommended range.',
    recommendedAction: 'No action needed.',
  }]
}
