// All temporary frontend data lives here. Replace via services/* when the backend exists.
export const RECOMMENDED_TITLE_RANGE = [50, 60]
export const RECOMMENDED_META_RANGE = [120, 160]
export const CATEGORIES = [['onPage', 'On-Page SEO'], ['technical', 'Technical SEO'], ['content', 'Content'], ['images', 'Images'], ['links', 'Links']]

const currentTitle = 'Example Domain - Home of Quality Web Services'

export const analysis = {
  id: 'analysis-001', url: 'https://example.com', score: 78, scoreStatus: 'Good',
  scoreSummary: 'Your website has a solid SEO foundation, with several areas that could be improved.',
  currentTitle, currentMeta: '', currentContent: 'We offer web services. Contact us to learn more about what we do.', targetKeyword: 'web services',
  checksCompleted: 24,
  categoryScores: { onPage: 85, technical: 92, content: 68, images: 70, links: 75 },
  priorityIssues: [
    { id: 'issue-1', severity: 'HIGH', title: 'Missing Meta Description', checkId: 'check-meta', optimizer: 'meta',
      description: 'Your page does not contain a meta description.', whyItMatters: 'Search engines may use other page content as the search snippet.', recommendedAction: 'Add a unique and relevant meta description.' },
    { id: 'issue-2', severity: 'MEDIUM', title: 'Missing Image Alt Text', checkId: 'check-alt', optimizer: 'content',
      description: '3 prominent image tags lack descriptive alt attributes.', whyItMatters: 'Reduces image search discoverability and accessibility.', recommendedAction: 'Add descriptive alt text to all informational images.' },
  ],
  checks: [
    { id: 'check-meta', category: 'onPage', name: 'Meta Description', status: 'Error', currentValue: 'Missing', message: 'No meta description tag was found on the homepage head element.', recommendedAction: 'Add a unique and relevant meta description.' },
    { id: 'check-title', category: 'onPage', name: 'Title Tag', status: 'Warning', currentValue: `${currentTitle.length} characters (too short)`, message: 'Optimal title length recommended for desktop and mobile SERPs is 50–60 characters.', recommendedAction: 'Consider creating a clearer title within the recommended range.' },
    { id: 'check-h1', category: 'onPage', name: 'Primary Heading (H1)', status: 'Passed', currentValue: 'Single unique H1 found', message: 'Clean heading hierarchy with descriptive top-level topic designation.', recommendedAction: 'No action needed.' },
    { id: 'check-canonical', category: 'onPage', name: 'Canonical Tag', status: 'Passed', currentValue: 'Valid self-referential canonical', message: 'Points correctly to canonical URL origin https://example.com/.', recommendedAction: 'No action needed.' },
    { id: 'check-https', category: 'onPage', name: 'HTTPS & Robots.txt', status: 'Passed', currentValue: 'Valid configuration', message: 'TLS certificate is valid and robots.txt correctly allows indexation of all public routes.', recommendedAction: 'No action needed.' },
    { id: 'check-sitemap', category: 'technical', name: 'XML Sitemap', status: 'Passed', currentValue: 'Sitemap found', message: 'A sitemap is available and referenced in robots.txt.', recommendedAction: 'No action needed.' },
    { id: 'check-viewport', category: 'technical', name: 'Viewport Tag', status: 'Passed', currentValue: 'Mobile viewport set', message: 'The page declares a responsive viewport.', recommendedAction: 'No action needed.' },
    { id: 'check-length', category: 'content', name: 'Content Length', status: 'Warning', currentValue: 'Short page content', message: 'The page has limited body copy to explain its topic.', recommendedAction: 'Expand the page with useful, specific information.' },
    { id: 'check-alt', category: 'images', name: 'Image Alt Text', status: 'Warning', currentValue: '3 images missing alt text', message: '3 prominent image tags lack descriptive alt attributes.', recommendedAction: 'Add descriptive alt text to all informational images.' },
    { id: 'check-internal', category: 'links', name: 'Internal Links', status: 'Passed', currentValue: 'Internal links found', message: 'The page links to other pages on the site.', recommendedAction: 'No action needed.' },
    { id: 'check-external', category: 'links', name: 'External Links', status: 'Passed', currentValue: 'External links found', message: 'The page links to other external sites.', recommendedAction: 'No action needed.' },
  ],
  analyzedAt: '2026-09-21T10:30:00.000Z',
}

export const dashboard = {
  stats: { totalAnalyses: 24, averageScore: 78, websitesAnalyzed: 8 },
  recentAnalyses: [
    { id: 'analysis-001', domain: 'example.com', score: 78, label: 'Good', analyzedAt: '2026-09-21T10:30:00.000Z' },
    { id: 'analysis-002', domain: 'mystore.io', score: 72, label: 'Good', analyzedAt: '2026-09-18T14:05:00.000Z' },
    { id: 'analysis-003', domain: 'techblog.dev', score: 91, label: 'Excellent', analyzedAt: '2026-09-14T09:12:00.000Z' },
    { id: 'analysis-004', domain: 'saaslanding.co', score: 64, label: 'Needs Work', analyzedAt: '2026-09-09T16:48:00.000Z' },
  ],
  priorityIssues: [
    { id: 'd1', severity: 'HIGH', title: 'Missing Meta Description', domain: 'example.com', analysisId: 'analysis-001', optimizer: 'meta' },
    { id: 'd2', severity: 'MEDIUM', title: 'Missing Image Alt Text', domain: 'mystore.io', analysisId: 'analysis-002', optimizer: 'content' },
    { id: 'd3', severity: 'MEDIUM', title: 'Multiple H1 Tags', domain: 'techblog.dev', analysisId: 'analysis-003', optimizer: 'content' },
  ],
}

// aiTitle/aiMeta/aiContent mock fixtures removed — services/aiApi.js now calls
// the real Phase 3 backend (POST /api/ai/optimize) instead of returning these.
