import { env } from './config/env.js'
import { createApp } from './app.js'

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`SEO Assistant API listening on http://localhost:${env.port}`)
  console.log(`Environment: ${env.nodeEnv}`)
  console.log(`Allowed client origin: ${env.clientUrl}`)
})

// Surface startup/runtime errors (e.g. port already in use) clearly instead of
// letting the process die silently.
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${env.port} is already in use. Stop the other process or change PORT in .env.`)
  } else {
    console.error('Server failed to start:', err)
  }
  process.exit(1)
})

function shutdown(signal) {
  console.log(`${signal} received, shutting down.`)
  server.close(() => process.exit(0))
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
