// Centralized, validated access to environment variables.
// Import `env` anywhere instead of reading `process.env` directly,
// so every part of the app agrees on defaults and required values.
import dotenv from 'dotenv'

dotenv.config()

const required = ['PORT', 'CLIENT_URL']
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  // Fail fast and loudly at startup rather than later with a confusing runtime error.
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`)
  console.error('Copy .env.example to .env and fill in the values.')
  process.exit(1)
}

// GROQ_API_KEY is intentionally NOT in `required` above: a missing key is a
// handled, request-time error (see aiController/groqService), not a reason to
// refuse to start the whole API. The default model lives here — ONE place —
// so nothing else in the app hardcodes a model name.
//
// NOTE: llama-3.3-70b-versatile (the original default here) was deprecated by
// Groq and shut down on 2026-08-16. Requests to it now fail with a 404
// "model_not_found" error. openai/gpt-oss-120b is Groq's own recommended
// replacement (see https://console.groq.com/docs/deprecations) and supports
// the same JSON-object response mode this app relies on. If this ever
// happens again, check that page and update the one line below.
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b'

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL,
  isProduction: process.env.NODE_ENV === 'production',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
}
