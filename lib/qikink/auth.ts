import { getQikinkConfig } from './config'
import { QikinkApiError } from './types'

let cachedToken: { value: string; expiresAt: number } | null = null
let pendingAuthentication: Promise<string> | null = null

export async function authenticate(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value
  if (pendingAuthentication) return pendingAuthentication

  pendingAuthentication = (async () => {
    const config = getQikinkConfig()
    const body = new URLSearchParams({ ClientId: config.clientId, client_secret: config.clientSecret })
    let response: Response
    try {
      response = await fetch(`${config.baseUrl}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body,
        cache: 'no-store',
      })
    } catch (error) {
      throw new QikinkApiError(`Unable to reach Qikink authentication endpoint: ${error instanceof Error ? error.message : 'unknown error'}`)
    }

    const payload = await response.json().catch(() => ({})) as Record<string, unknown>
    if (!response.ok) throw new QikinkApiError(String(payload.message || 'Qikink authentication failed'), response.status, payload)

    const token = payload.Accesstoken ?? payload.access_token
    if (typeof token !== 'string' || !token) throw new QikinkApiError('Qikink authentication response did not include an access token', response.status, payload)

    const expiresIn = typeof payload.expires_in === 'number' ? payload.expires_in : 3600
    cachedToken = { value: token, expiresAt: Date.now() + Math.max(expiresIn - 60, 60) * 1000 }
    return token
  })()

  try {
    return await pendingAuthentication
  } finally {
    pendingAuthentication = null
  }
}

export function clearAuthenticationCache() {
  cachedToken = null
}

