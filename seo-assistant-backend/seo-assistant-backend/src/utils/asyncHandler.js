// Wrap async route handlers so a rejected promise / thrown error is forwarded
// to next(err) automatically instead of crashing the process unhandled.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
