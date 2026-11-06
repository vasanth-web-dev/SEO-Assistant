import * as cheerio from 'cheerio'
import { fetchPageHtml } from './fetcher/pageFetcher.js'
import { titleRule } from './rules/titleRule.js'
import { metaRule } from './rules/metaRule.js'
import { headingRule } from './rules/headingRule.js'
import { imageRule } from './rules/imageRule.js'
import { linkRule } from './rules/linkRule.js'
import { canonicalRule } from './rules/canonicalRule.js'
import { technicalRule } from './rules/technicalRule.js'
import { contentRule, extractContentSnippet } from './rules/contentRule.js'
import { categoryScore, overallScore, scoreStatus, scoreSummary } from './scoreCalculator.js'

const CATEGORY_KEYS = ['onPage', 'technical', 'content', 'images', 'links']

// Orchestrates: fetch -> parse -> run rules -> score -> shape the response.
// This is the only function the controller calls; it owns the pipeline.
export async function analyzeUrl(targetUrl) {
  const { html, finalUrl } = await fetchPageHtml(targetUrl)
  const $ = cheerio.load(html)
  const pageUrl = finalUrl
  const ctx = { $, url: pageUrl }

  const rawChecks = [
    ...titleRule(ctx),
    ...metaRule(ctx),
    ...headingRule(ctx),
    ...canonicalRule(ctx),
    ...technicalRule(ctx),
    ...contentRule(ctx),
    ...imageRule(ctx),
    ...linkRule(ctx),
  ]

  const categoryScores = {}
  for (const key of CATEGORY_KEYS) {
    categoryScores[key] = categoryScore(rawChecks.filter((c) => c.category === key))
  }
  const score = overallScore(categoryScores)

  const priorityIssues = rawChecks
    .filter((c) => c.priority)
    .map((c) => ({
      id: `issue-${c.id}`,
      severity: c.priority.severity,
      title: c.priority.title,
      description: c.priority.description,
      checkId: c.id,
      optimizer: c.priority.optimizer ?? null,
      whyItMatters: c.priority.whyItMatters,
      recommendedAction: c.recommendedAction,
    }))
    .sort((a, b) => ({ HIGH: 0, MEDIUM: 1, LOW: 2 }[a.severity] - { HIGH: 0, MEDIUM: 1, LOW: 2 }[b.severity]))

  const titleCheck = rawChecks.find((c) => c.id === 'title')
  const metaCheck = rawChecks.find((c) => c.id === 'meta-description')
  const titleValue = titleCheck?.rawValue ?? ''
  const metaValue = metaCheck?.rawValue ?? ''

  const checks = rawChecks.map(({ priority, rawValue, ...rest }) => ({ ...rest, currentValue: rest.value }))

  return {
    url: pageUrl,
    page: {
      title: { value: titleValue, length: titleValue.length },
      metaDescription: { value: metaValue, length: metaValue.length },
    },
    currentTitle: titleValue,
    currentMeta: metaValue,
    currentContent: extractContentSnippet($),
    targetKeyword: '',
    score,
    scoreStatus: scoreStatus(score),
    scoreSummary: scoreSummary(score),
    categoryScores,
    checksCompleted: checks.length,
    priorityIssues,
    checks,
    analyzedAt: new Date().toISOString(),
  }
}
