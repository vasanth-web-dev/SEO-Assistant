// Runs when no route matched. Returns JSON (never an HTML error page) so the
// frontend can always parse the response.
export function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}
