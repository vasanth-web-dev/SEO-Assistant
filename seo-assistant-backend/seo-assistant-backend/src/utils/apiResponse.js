// Small helpers so every endpoint returns the same { success, message, ... } shape.
export function sendSuccess(res, { message = 'OK', data, status = 200 } = {}) {
  const body = { success: true, message }
  if (data !== undefined) body.data = data
  return res.status(status).json(body)
}

export function sendError(res, { message = 'Something went wrong', status = 500, errors } = {}) {
  const body = { success: false, message }
  if (errors !== undefined) body.errors = errors
  return res.status(status).json(body)
}
