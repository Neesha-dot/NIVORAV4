// Local development entry-point.
// Imports the shared Express app and starts a real HTTP server.
// On Netlify the app is imported by netlify/functions/api.js instead.
import app from './app.js'
import { connectDB } from './db.js'

const PORT = process.env.API_PORT || 3001

// Start the HTTP server immediately so routes that don't need MongoDB
// (e.g. admin login, health check) are available right away.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] API running on http://0.0.0.0:${PORT}`)
})

// Connect to MongoDB in the background — failure is logged but does not
// crash the process.  Routes that require DB will return errors if it's
// unavailable, but credential-only routes keep working.
connectDB().catch(err => {
  console.error('[Server] MongoDB connection failed:', err.message)
})
