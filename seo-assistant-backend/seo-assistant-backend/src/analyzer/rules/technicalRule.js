// Checks: HTTPS, a viewport meta tag, a declared language, and a noindex
// directive on the page's own <meta name="robots"> tag.
//
// Important limitation: this does NOT fetch or validate robots.txt or a
// sitemap.xml. It only inspects the HTML of the page that was fetched.
export function technicalRule({ $, url }) {
  const checks = []

  let isHttps = false
  try { isHttps = new URL(url).protocol === 'https:' } catch { isHttps = false }
  checks.push(isHttps ? {
    id: 'https', category: 'technical', name: 'HTTPS', status: 'Passed',
    value: 'Secure connection', message: 'The page is served over HTTPS.', recommendedAction: 'No action needed.',
  } : {
    id: 'https', category: 'technical', name: 'HTTPS', status: 'Error',
    value: 'Not using HTTPS', message: 'The page is not served over a secure HTTPS connection.',
    recommendedAction: 'Serve the site over HTTPS.',
    priority: {
      severity: 'HIGH', title: 'Page Not Served Over HTTPS', optimizer: null,
      description: 'The analyzed page is not served over HTTPS.',
      whyItMatters: 'Browsers flag non-HTTPS pages as not secure, and HTTPS is a baseline ranking signal.',
    },
  })

  const viewport = $('meta[name="viewport"]').attr('content')
  checks.push(viewport ? {
    id: 'viewport', category: 'technical', name: 'Viewport Tag', status: 'Passed',
    value: 'Mobile viewport set', message: 'The page declares a responsive viewport.', recommendedAction: 'No action needed.',
  } : {
    id: 'viewport', category: 'technical', name: 'Viewport Tag', status: 'Warning',
    value: 'Missing', message: 'No viewport meta tag was found.',
    recommendedAction: 'Add a <meta name="viewport"> tag so the page renders correctly on mobile devices.',
    priority: {
      severity: 'MEDIUM', title: 'Missing Viewport Tag', optimizer: null,
      description: 'The page has no viewport meta tag.',
      whyItMatters: 'Without a viewport tag, the page may not display correctly on mobile devices.',
    },
  })

  const lang = $('html').attr('lang')
  checks.push(lang ? {
    id: 'language', category: 'technical', name: 'Declared Language', status: 'Passed',
    value: lang, message: `The page declares its language as "${lang}".`, recommendedAction: 'No action needed.',
  } : {
    id: 'language', category: 'technical', name: 'Declared Language', status: 'Warning',
    value: 'Not declared', message: 'The <html> tag does not declare a lang attribute.',
    recommendedAction: 'Add a lang attribute to the <html> tag (for example, lang="en").',
    priority: {
      severity: 'LOW', title: 'Missing Language Declaration', optimizer: null,
      description: 'The page does not declare a language on the <html> tag.',
      whyItMatters: 'A declared language helps search engines and screen readers serve the page to the right audience.',
    },
  })

  const robotsMeta = ($('meta[name="robots"]').attr('content') || '').toLowerCase()
  const noindex = robotsMeta.includes('noindex')
  checks.push(noindex ? {
    id: 'noindex', category: 'technical', name: 'Indexability', status: 'Error',
    value: 'noindex detected', message: 'A noindex directive was found in the page meta tags.',
    recommendedAction: 'Remove the noindex directive if you want this page to appear in search results.',
    priority: {
      severity: 'HIGH', title: 'Page Set to Noindex', optimizer: null,
      description: 'The page includes a meta robots noindex directive.',
      whyItMatters: 'A noindex directive tells search engines not to include this page in search results at all.',
    },
  } : {
    id: 'noindex', category: 'technical', name: 'Indexability', status: 'Passed',
    value: 'Indexable',
    message: 'No noindex directive was found in the page\u2019s meta tags.',
    recommendedAction: 'No action needed.',
  })

  return checks
}
