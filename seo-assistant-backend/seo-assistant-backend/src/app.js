import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import apiRoutes from './routes/index.js'
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

export function createApp() {
  const app = express()

  // Only the configured frontend origin may call this API during development.
  app.use(cors({ origin: env.clientUrl }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/api', apiRoutes)

  // Must come after all routes: catches anything that didn't match above.
  app.use(notFoundMiddleware)
  // Must be the last app.use(): Express recognizes it as an error handler by its 4 arguments.
  app.use(errorMiddleware)

  return app
}
