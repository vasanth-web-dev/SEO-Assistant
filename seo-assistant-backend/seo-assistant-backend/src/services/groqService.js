import Groq from 'groq-sdk'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

// Lazily constructed so a missing key doesn't throw at import time — only
// when an AI endpoint is actually called. The client itself never logs or
// returns env.groqApiKey anywhere.
let client = null
function getClient() {
  if (!env.groqApiKey) {
    throw new ApiError(503, 'AI optimization is not configured on this server. Set GROQ_API_KEY to enable it.')
  }
  if (!client) {
    client = new Groq({ apiKey: env.groqApiKey, timeout: 20000, maxRetries: 2 })
  }
  return client
}

// The only place in the app that talks to Groq. Takes a system + user
// prompt, returns the raw text of the model's reply. Callers are
// responsible for parsing/validating that text as JSON (see aiResponseSchema.js).
export async function requestCompletion({ systemPrompt, userPrompt }) {
  const groq = getClient()

  let completion
  try {
    completion = await groq.chat.completions.create({
      model: env.groqModel,
      temperature: 0.4,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })
  } catch (err) {
    // groq-sdk errors are modeled on the OpenAI SDK: HTTP-level failures carry
    // a `.status`; connection/timeout failures carry a distinct `.name`.
    // Never forward err.message verbatim — it can include request details.
    if (err?.status === 401 || err?.status === 403) {
      throw new ApiError(503, 'AI optimization is not configured correctly. Check the Groq API key.')
    }
    if (err?.status === 429) {
      throw new ApiError(429, 'The AI service is rate-limited right now. Please try again shortly.')
    }
    if (err?.name === 'APIConnectionTimeoutError' || err?.status === 408) {
      throw new ApiError(504, 'The AI service took too long to respond. Please try again.')
    }
    throw new ApiError(502, 'AI optimization failed. Please try again.')
  }

  const text = completion?.choices?.[0]?.message?.content
  if (!text || !text.trim()) {
    throw new ApiError(502, 'AI optimization failed. Please try again.')
  }
  return text
}
