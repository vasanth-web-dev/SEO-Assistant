// A known, expected application error (bad input, not found, etc.) with an HTTP status
// attached. Controllers/middleware can `throw new ApiError(...)` and the central error
// handler will turn it into a clean JSON response with the right status code.
export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.isApiError = true
  }
}
