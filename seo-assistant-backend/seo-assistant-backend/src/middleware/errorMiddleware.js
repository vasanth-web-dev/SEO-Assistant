import { env } from '../config/env.js'

// Centralized error handler — must be registered last, after all routes.
// Any `next(err)` call, or a thrown error inside an async handler wrapped
// with asyncHandler, ends up here.
// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  const status = err.isApiError ? err.status : err.status || 500
  const message = err.isApiError || status < 500 ? err.message : 'Something went wrong'

  if (!env.isProduction) {
    console.error(err)
  } else if (status >= 500) {
    // Still log server-side even in production; just don't leak internals to the client.
    console.error(`[${new Date().toISOString()}] ${err.message}`)
  }

  const body = { success: false, message }
  if (err.errors) body.errors = err.errors
  if (!env.isProduction && status >= 500) body.stack = err.stack

  res.status(status).json(body)
}
