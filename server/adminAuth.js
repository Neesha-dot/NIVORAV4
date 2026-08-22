/**
 * Server-side admin credentials and session token.
 * Credentials never leave the server — the login endpoint validates them
 * and returns a short-lived session token the client sends back as
 * x-admin-token on every mutating request.
 */
import crypto from 'crypto'

// One token per server lifetime — rotates on restart / cold start
const SESSION_TOKEN = crypto.randomUUID()

function getCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD?.trim()
  if (!username || !password) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set')
  }
  return { username, password }
}

export function checkCredentials(username, password) {
  const creds = getCredentials()
  return username?.trim() === creds.username && password?.trim() === creds.password
}

export function getSessionToken() {
  return SESSION_TOKEN
}

export function validateToken(token) {
  return typeof token === 'string' && token === SESSION_TOKEN
}
