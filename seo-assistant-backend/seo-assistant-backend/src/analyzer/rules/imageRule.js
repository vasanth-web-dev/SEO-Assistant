// Checks: how many images on the page are missing meaningful alt text.
// No dedicated "image" AI optimizer exists yet, so the content optimizer is
// the closest fit if the user wants help addressing this.
export function imageRule({ $ }) {
  const images = $('img')
  const total = images.length

  if (total === 0) {
    return [{
      id: 'image-alt-text', category: 'images', name: 'Image Alt Text', status: 'Passed',
      value: 'No images found',
      message: 'No images were found on the page to check for alt text.',
      recommendedAction: 'No action needed.',
    }]
  }

  let missing = 0
  images.each((_, el) => {
    const alt = $(el).attr('alt')
    if (!alt || !alt.trim()) missing += 1
  })

  if (missing === 0) {
    return [{
      id: 'image-alt-text', category: 'images', name: 'Image Alt Text', status: 'Passed',
      value: `${total} of ${total} images have alt text`,
      message: 'All images on the page have alt text.',
      recommendedAction: 'No action needed.',
    }]
  }

  const status = missing === total ? 'Error' : 'Warning'
  return [{
    id: 'image-alt-text', category: 'images', name: 'Image Alt Text', status,
    value: `${missing} of ${total} images missing alt text`,
    message: `${missing} of ${total} image tags lack descriptive alt attributes.`,
    recommendedAction: 'Add descriptive alt text to all informational images.',
    priority: {
      severity: missing === total ? 'HIGH' : 'MEDIUM', title: 'Missing Image Alt Text', optimizer: 'content',
      description: `${missing} of ${total} image tags lack descriptive alt attributes.`,
      whyItMatters: 'Alt text helps search engines and screen readers understand image content, improving accessibility and image search visibility.',
    },
  }]
}
