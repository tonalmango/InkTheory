import { authenticate, clearAuthenticationCache } from './auth'
import { getQikinkConfig } from './config'
import { QikinkApiError } from './types'

async function request<T>(path: string, init: RequestInit = {}, retryOnUnauthorized = true): Promise<T> {
  const config = getQikinkConfig()
  const token = await authenticate(!retryOnUnauthorized)
  let response: Response
  try {
    response = await fetch(`${config.baseUrl}${path}`, {
      ...init,
      headers: {
        ClientId: config.clientId,
        Accesstoken: token,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...init.headers,
      },
      cache: 'no-store',
    })
  } catch (error) {
    throw new QikinkApiError(`Unable to reach Qikink: ${error instanceof Error ? error.message : 'unknown error'}`)
  }

  if (response.status === 401 && retryOnUnauthorized) {
    clearAuthenticationCache()
    return request<T>(path, init, false)
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new QikinkApiError(String(payload?.message || `Qikink request failed (${response.status})`), response.status, payload)
  return payload as T
}

export const qikinkClient = {
  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  },
}

