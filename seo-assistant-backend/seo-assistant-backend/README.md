# SEO Assistant Backend

API backend for SEO Assistant — an application that lets users submit a public web
page URL, analyzes its basic SEO factors, and offers AI-powered optimization
suggestions for the title, meta description, and content.

## Current Phase

**Phase 3 — Groq AI Integration.**

- Phase 1 set up the Express application, environment configuration, CORS, JSON
  middleware, routing structure, a health check, and centralized 404 / error
  handling.
- Phase 2 added the deterministic analysis pipeline: `POST /api/analyze` fetches
  a submitted page, parses it with Cheerio, runs a rule engine, and returns
  scored, structured results.
- Phase 3 (this phase) adds `POST /api/ai/optimize`, which uses Groq to generate
  title, meta description, and content optimization *suggestions* on top of an
  existing Phase 2 analysis. Groq never replaces the deterministic rule engine —
  it only proposes text a person can choose to use.

Not implemented yet — planned for Phase 4: MongoDB, user accounts, authentication,
saved analyses.

## Requirements

- Node.js 18 or newer
- npm
- Optional: a Groq API key from https://console.groq.com/keys, to actually
  generate AI suggestions. The API works without one — `/api/ai/optimize` just
  returns a clear "not configured" error instead.

## Installation

```
npm install
```

## Environment

Copy `.env.example` to `.env` and adjust:

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=
GROQ_MODEL=
```

- `PORT` — port the API listens on.
- `CLIENT_URL` — the frontend origin allowed by CORS.
- `NODE_ENV` — `development` or `production`. In production, error responses
  omit stack traces and internal details.
- `GROQ_API_KEY` — your Groq API key. **Backend-only.** Never put this in the
  frontend, in `VITE_`-prefixed variables, in source code, or in a commit.
  Leave it blank to run without AI optimization.
- `GROQ_MODEL` — optional. Defaults to `openai/gpt-oss-120b` (a current Groq
  production model) if left blank. The default lives in exactly one place,
  `src/config/env.js`, so changing it there changes it everywhere. Groq
  deprecates models on a rolling basis (the original default here,
  `llama-3.3-70b-versatile`, was shut down on 2026-08-16) — if `/api/ai/optimize`
  starts returning a `model_not_found` error, check
  https://console.groq.com/docs/deprecations and update the model there.

`PORT` and `CLIENT_URL` are validated at startup (the server refuses to start
without them). `GROQ_API_KEY` is **not** — a missing key is a handled, per-request
error (503 on `/api/ai/optimize`), not a reason to refuse to start the whole API.

## Development

```
npm run dev
```

## Production

```
npm start
```

## Health Check

```
GET /api/health
```

```json
{
  "success": true,
  "message": "SEO Assistant API is running",
  "data": { "timestamp": "2026-10-05T10:25:05.983Z" }
}
```

No dependency on a database, Groq, or the SEO analyzer — keeps working unchanged
through every phase.

## Analyze a Page

```
POST /api/analyze
Content-Type: application/json

{ "url": "https://example.com" }
```

Validates the URL, fetches the page (10s timeout, follows redirects, requires an
HTML response), parses it with Cheerio, runs the rule engine, and returns:

```json
{
  "success": true,
  "message": "SEO analysis completed successfully",
  "data": {
    "analysis": {
      "url": "...",
      "page": { "title": { "value": "...", "length": 0 }, "metaDescription": { "value": "...", "length": 0 } },
      "currentTitle": "...", "currentMeta": "...", "currentContent": "...", "targetKeyword": "",
      "score": 78, "scoreStatus": "Good", "scoreSummary": "...",
      "categoryScores": { "onPage": 85, "technical": 92, "content": 68, "images": 70, "links": 75 },
      "checksCompleted": 13,
      "priorityIssues": [ { "id": "...", "severity": "HIGH", "title": "...", "checkId": "...", "optimizer": "meta", "whyItMatters": "...", "recommendedAction": "..." } ],
      "checks": [ { "id": "...", "category": "onPage", "name": "...", "status": "Warning", "value": "...", "currentValue": "...", "message": "...", "recommendedAction": "..." } ],
      "analyzedAt": "..."
    }
  }
}
```

Errors (invalid URL, unreachable site, timeout, non-HTML response) return the
same `{ "success": false, "message": "..." }` shape with an appropriate status
(`400`, `422`, `502`, or `504`).

No analysis is persisted — there is no database yet. Each call re-fetches and
re-analyzes the page from scratch.

### SEO Rule Engine

`src/analyzer/` runs eight rule modules over the fetched page:

| Rule | Category | Checks |
|---|---|---|
| `titleRule` | onPage | title tag exists; length within 50–60 chars |
| `metaRule` | onPage | meta description exists; length within 120–160 chars |
| `headingRule` | onPage | H1 presence/count; H2/H3 structure (informational) |
| `canonicalRule` | technical | canonical tag exists and self-references the page |
| `technicalRule` | technical | HTTPS, viewport tag, declared `lang`, `noindex` on the page's own `<meta name="robots">` |
| `contentRule` | content | visible word count (≥150 words); headings have supporting paragraphs |
| `imageRule` | images | share of `<img>` tags missing `alt` text |
| `linkRule` | links | internal vs. external link counts |

Statuses are only ever `Passed`, `Warning`, or `Error`. Category scores are the
average of that category's check scores (`Passed=100, Warning=60, Error=20`,
rounded). The overall score is a weighted sum — `onPage 30% + technical 25% +
content 20% + images 10% + links 15%` — rounded to the nearest whole number.
`scoreStatus` is `Excellent` (≥90), `Good` (≥70), or `Needs Work` (<70).

Each rule assigns its own `priorityIssues` severity individually (not derived
automatically from status), so the system stays simple and explainable.
Severities are only ever `HIGH`, `MEDIUM`, or `LOW`.

### Known limitations (Phase 2)

- **robots.txt / sitemap.xml are not fetched or validated.** The "Indexability"
  check only reads the page's own `<meta name="robots">` tag.
- **SSRF protection is minimal.** Only the URL's protocol is validated
  (`http:`/`https:`). There is no private-IP blocklist or DNS-rebinding
  protection — acceptable for local/academic use, not for accepting arbitrary
  public URLs in production without hardening.
- **No full-site crawling.** Only the single submitted URL is analyzed.
- **Nothing is cached server-side.** Two requests for the same URL run the full
  pipeline twice.

## AI Optimization (Phase 3)

```
POST /api/ai/optimize
Content-Type: application/json

{
  "type": "title",
  "analysis": { "...": "the analysis object returned by POST /api/analyze" },
  "targetKeyword": "web hosting"
}
```

- `type` — one of `"title"`, `"meta"`, `"content"`.
- `analysis` — required. The existing Phase 2 analysis object (or, at minimum,
  one with a non-empty `url`). The page is **not** re-fetched or re-analyzed —
  Groq only sees the fields already extracted by the deterministic rule engine
  (`currentTitle`, `currentMeta`, `currentContent`, `score`, `priorityIssues`).
- `targetKeyword` — optional. If omitted or blank, the prompt explicitly tells
  the model not to invent one and to base suggestions on the page content alone.

Response (title/meta):

```json
{
  "success": true,
  "message": "AI suggestions generated successfully",
  "data": {
    "type": "title",
    "suggestions": [
      { "text": "Fast Web Hosting | Example Domain", "reason": "Leads with the main service and brand." },
      { "text": "Reliable Hosting Plans - Example Domain", "reason": "Clear and descriptive of page content." },
      { "text": "Example Domain: Hosting Built for Growing Sites", "reason": "Speaks to audience and differentiator." }
    ]
  }
}
```

Response (content) — recommendations, not a rewritten page:

```json
{
  "success": true,
  "message": "AI suggestions generated successfully",
  "data": {
    "type": "content",
    "suggestions": [
      { "title": "Add a pricing section", "description": "Plans are described but never priced.", "example": "Add a short pricing table under \"Our Plans\"." }
    ]
  }
}
```

### Architecture

```
Route (aiRoutes.js)
  -> Controller (aiController.js)        — validates type/analysis, wires the rest together
  -> Prompts (aiPrompts.js)              — builds the system + user prompt per type
  -> Groq Service (groqService.js)       — the ONLY file that talks to Groq
  -> Response Schema (aiResponseSchema.js) — parses, validates, and normalizes the model's JSON
```

Groq is never called from a route handler directly, and never from the React
frontend — only `groqService.js` holds a Groq client, constructed lazily so a
missing key doesn't crash startup.

### Why title/meta and content look different

Per the Phase 3 spec, the Content Optimizer gives **recommendations**, not a
full rewritten passage ("Do NOT blindly rewrite the entire webpage"). So its
response shape — a list of `{title, description, example}` suggestions — is
deliberately different from title/meta's `{text, reason}` shape, and the
frontend's Content Optimizer panel now renders a list of recommendation cards
instead of the old single "optimized content" block. See "Frontend
Integration" below for exactly what changed and why.

### Prompt design (`src/services/aiPrompts.js`)

Every prompt (title, meta, content) shares the same non-negotiable rules,
stated explicitly in the system prompt:

- Use only the page information provided — never invent facts about the page,
  its business, or its content.
- Never invent a target keyword; if none was supplied, say so and proceed
  without one.
- Never claim or imply a guaranteed Google ranking, traffic, or CTR increase.
- Respond with a single valid JSON object, no markdown fences, matching an
  exact schema spelled out in the prompt.

### Structured output & validation (`src/services/aiResponseSchema.js`)

Requests use Groq's JSON object mode (`response_format: { type: "json_object"
}`), which guarantees syntactically valid JSON but not that it matches *our*
schema. `aiResponseSchema.js` is the one place that decides whether a response
is trustworthy:

1. Parse the raw text as JSON; if that fails, try to recover a `{...}` block
   from stray text (models occasionally ignore the "no commentary" instruction).
2. Require a `suggestions` array.
3. Drop any item missing its required fields (`text`+`reason`, or for content,
   `title`+`description`).
4. Require at least 1 valid item remaining; cap the list at 3 (title/meta) or 5
   (content).
5. If any step fails, throw a generic `ApiError(502, "AI optimization failed.
   Please try again.")` — the raw model output is never echoed back to the
   client or logged, since it could contain anything the model produced.

### Error handling

| Situation | Status | Message |
|---|---|---|
| Missing `type` | 400 | `A "type" field is required.` |
| Unsupported `type` | 400 | `Unsupported type "...". Use one of: title, meta, content.` |
| Missing `analysis` | 400 | `An "analysis" object is required.` |
| Invalid `analysis` (no `url`) | 400 | `The provided "analysis" object is missing required page information.` |
| `GROQ_API_KEY` not set | 503 | `AI optimization is not configured on this server. Set GROQ_API_KEY to enable it.` |
| Groq returns 401/403 | 503 | `AI optimization is not configured correctly. Check the Groq API key.` |
| Groq returns 429 | 429 | `The AI service is rate-limited right now. Please try again shortly.` |
| Groq request times out | 504 | `The AI service took too long to respond. Please try again.` |
| Any other Groq/SDK error | 502 | `AI optimization failed. Please try again.` |
| Model's response isn't usable JSON | 502 | `AI optimization failed. Please try again.` |

All of these go through the same centralized error middleware as Phase 1/2 —
no AI-specific response format. The Groq API key is never included in a
response body, a log line, or a stack trace.

### Known limitations (Phase 3)

- **No live Groq test was performed.** No `GROQ_API_KEY` was available in the
  environment this was built in, and this sandbox's network policy blocks
  outbound requests to `api.groq.com` regardless. Every code path *except* an
  actual network call to Groq was tested — see "Testing Performed" below for
  exactly what that covers and how.
- **No retry/backoff beyond the SDK's own `maxRetries: 2`.** A persistent 429
  surfaces to the user as a 429 rather than being queued or retried server-side.
- **Suggestion quality depends entirely on the model.** The schema validator
  guarantees *shape*, not that the writing is good — a technically valid but
  mediocre suggestion will still pass through.

## Frontend Integration

Inspected the existing frontend before changing anything.

**Phase 2** (already integrated): `analysisApi.js`'s `analyzeUrl()` calls
`POST /api/analyze` and caches the result by client-generated id so
`getAnalysis(id)` keeps working unchanged.

**Phase 3** changes:

- `services/aiApi.js` — `generate(kind, { analysis, targetKeyword })` now calls
  `POST /api/ai/optimize` instead of returning mock fixtures. For `title`/`meta`,
  it reshapes the backend's flat `suggestions[]` into the `{ recommended,
  others }` shape the existing `SuggestionCard` UI already expected (first
  suggestion = recommended, rest = others) — a presentation-only adapter, not a
  new backend contract. For `content`, it passes `{ suggestions }` straight
  through.
- `pages/AiOptimizer/AiOptimizer.jsx` — `TextOptimizer` (title/meta) now sends
  the real analysis object and the user's live keyword/edits on every
  "Generate Suggestions" click, instead of ignoring them. Errors show the
  backend's actual message instead of a generic one (same pattern already used
  by `Analyze.jsx` for Phase 2).
- `components/optimizer/ContentSuggestionCard.jsx` — **new file.** The Content
  Optimizer's old UI (one "optimized content" block with a single Copy button)
  only made sense for the old mock, which rewrote the whole passage. Phase 3's
  content optimizer intentionally returns a *list of recommendations* instead
  (per the written Phase 3 scope: "Do NOT blindly rewrite the entire webpage").
  Since there is no way to show a list of 1–5 recommendations in a
  single-block layout without misrepresenting the data, `ContentOptimizer`
  now renders a list of cards — reusing the exact same `.card`/`.why` visual
  classes already used elsewhere in the app (e.g. `SuggestionCard`), not a new
  visual style. No navigation, routes, colors, typography, or layout
  conventions changed elsewhere in the app.
- `data/mockData.js` — removed the now-unused `aiTitle`/`aiMeta`/`aiContent`
  mock fixtures (dead code once `aiApi.js` stopped importing them).

"Use Suggestion" still only copies text into the editable field, as before —
it does not publish anything or call any external service.

## Security

- `GROQ_API_KEY` is read only via `src/config/env.js`, used only inside
  `src/services/groqService.js`, and is never interpolated into a log message,
  an error message, or an API response.
- `.env` is listed in `.gitignore`; `.env.example` ships with both Groq
  variables blank.
- The frontend has no knowledge of the key at all — no `VITE_GROQ_API_KEY`
  exists anywhere, and the architecture is strictly React → Express → Groq,
  never React → Groq.
- Confirmed by grepping every test response and server log produced during
  development for the key string and for `GROQ_API_KEY=` — none found (the
  only matches are the error *message*, which names the env var, not its value).

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.js                   # validated env access; single default-model fallback
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── analyzeController.js     # POST /api/analyze handler
│   │   └── aiController.js          # POST /api/ai/optimize handler
│   ├── routes/
│   │   ├── index.js                 # mounts /api/health, /api/analyze, /api/ai
│   │   ├── healthRoutes.js
│   │   ├── analyzeRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── errorMiddleware.js       # centralized JSON error handler
│   │   └── notFoundMiddleware.js
│   ├── utils/
│   │   ├── apiResponse.js           # sendSuccess / sendError helpers
│   │   ├── ApiError.js              # known-error class with an HTTP status
│   │   ├── asyncHandler.js          # wraps async route handlers
│   │   └── validateUrl.js           # POST /api/analyze request validation
│   ├── analyzer/
│   │   ├── seoEngine.js             # orchestrates fetch -> parse -> rules -> score
│   │   ├── scoreCalculator.js       # category + overall scoring, status, summary text
│   │   ├── fetcher/
│   │   │   └── pageFetcher.js       # timeout, redirects, content-type checks
│   │   └── rules/                   # titleRule, metaRule, headingRule, imageRule,
│   │                                # linkRule, canonicalRule, technicalRule, contentRule
│   ├── services/
│   │   ├── groqService.js           # the only file that talks to Groq
│   │   ├── aiPrompts.js             # title/meta/content prompt construction
│   │   └── aiResponseSchema.js      # parse, validate, normalize Groq's JSON
│   ├── models/      (empty — reserved for Phase 4, MongoDB)
│   ├── app.js       # Express app: middleware, routes, error handling
│   └── server.js    # loads env, starts the HTTP server
├── .env.example
├── .gitignore
└── package.json
```

## Testing Performed

Every test below was actually executed against a running server in this
environment (not claimed without running).

**Phase 1 regression**
- `GET /api/health` → 200, valid JSON.
- `GET /api/test-invalid` (and `/api/nope`) → 404, valid JSON, not HTML.

**Phase 2 regression**
- `POST /api/analyze` against local HTML fixtures (a deliberately broken page
  and a clean one) → verified every check, category score, and overall score
  by hand against the returned JSON.
- Connection-refused, DNS-failure, and 10-second-timeout cases → clean 502/504,
  server stayed healthy afterward.
- 5 concurrent `/api/analyze` requests → all succeeded, health check still 200.

**Phase 3 — request validation (live server, no Groq call reached)**
- Missing `type` → 400.
- Unsupported `type` (`"keywords"`) → 400.
- Missing `analysis` → 400.
- Invalid `analysis` (no `url`) → 400.
- Valid request with no `GROQ_API_KEY` configured, for all three types
  (title/meta/content) → 503 `"AI optimization is not configured..."`, server
  stayed healthy afterward, no key material in any response or log line.

**Phase 3 — Groq service logic (no live network call; the Groq SDK's own
`chat.completions.create` method was replaced in-process with a fake
implementation, so everything *except* the actual HTTP call to Groq's servers
ran for real)**
- Simulated 401 → mapped to 503 "not configured correctly".
- Simulated 429 → mapped to 429 "rate-limited".
- Simulated `APIConnectionTimeoutError` → mapped to 504 "took too long".
- Simulated generic 500 → mapped to 502 "AI optimization failed".
- Empty completion content → 502.
- Missing `choices` array → 502.
- Valid completion → text returned successfully.

**Phase 3 — response schema validation (`aiResponseSchema.js`, pure unit tests,
8 cases)**
- Non-JSON text → rejected (502).
- JSON missing the `suggestions` key → rejected.
- JSON wrapped in a markdown fence with stray text → recovered and parsed
  correctly.
- All items missing required fields → rejected.
- Valid title response with 4 items → accepted and trimmed to 3.
- Valid content response → accepted, correct shape.
- Empty `suggestions` array → rejected.
- `suggestions` not an array → rejected.

**Phase 3 — full pipeline, end to end (Groq's SDK method faked with a
realistic valid JSON reply; everything else — Express routing, the
controller, prompt building, response validation, and the actual HTTP
request/response cycle — ran for real)**
- `POST /api/ai/optimize` with `type: "title"`, `"meta"`, and `"content"` →
  all returned `200` with the documented response shape.
- Ran the frontend's *actual* `aiApi.js`/`api.js` code (via Node, using the
  frontend's own installed axios) against the real running backend → confirmed
  the `{ recommended, others }` reshaping for title/meta and the pass-through
  shape for content both work correctly end to end.

**Frontend build**
- `npm run build` passed after the Phase 3 integration changes (new
  `ContentSuggestionCard.jsx`, updated `aiApi.js` and `AiOptimizer.jsx`).

**Not tested — stated plainly rather than faked**
- No actual request reached `api.groq.com`: no `GROQ_API_KEY` was available in
  this environment, and this sandbox's network policy blocks that domain
  regardless. The error-path and schema-validation tests above cover
  everything *except* "does a real Groq model actually produce a good,
  valid-shaped answer for a real page" — that still needs a real run with a
  real key outside this sandbox.
- No browser-level UI testing was performed (no headless browser available
  here) — only `npm run build` (compiles) and Node-level HTTP tests against
  the real backend (confirms the data layer). Clicking through the actual
  rendered AI Optimizer page in a browser has not been verified.

## Phase 4 Readiness

The route structure in `src/routes/index.js` already reserves (commented out,
not implemented) the mount points for:

- `/api/auth` — register/login/logout
- `/api/analyses` — saved analyses

The empty `models/` folder exists so Phase 4 can add MongoDB/Mongoose models
without restructuring the project. Phase 4 was not started.
