export type QikinkEnvironment = 'sandbox' | 'live'

const DEFAULT_URLS: Record<QikinkEnvironment, string> = {
  sandbox: 'https://sandbox.qikink.com',
  live: 'https://api.qikink.com',
}

export function getQikinkConfig() {
  const environment = (process.env.QIKINK_ENVIRONMENT || 'sandbox').toLowerCase()
  if (environment !== 'sandbox' && environment !== 'live') {
    throw new Error('QIKINK_ENVIRONMENT must be either "sandbox" or "live"')
  }

  const clientId = process.env.QIKINK_CLIENT_ID
  const clientSecret = process.env.QIKINK_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('Set QIKINK_CLIENT_ID and QIKINK_CLIENT_SECRET before using Qikink')
  }

  return {
    environment: environment as QikinkEnvironment,
    clientId,
    clientSecret,
    baseUrl: (process.env.QIKINK_BASE_URL || DEFAULT_URLS[environment]).replace(/\/$/, ''),
  }
}

