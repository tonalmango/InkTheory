const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || ''

function assertPayPalCredentials() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not configured')
  }
}

async function getAccessToken() {
  assertPayPalCredentials()

  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error_description || data.message || 'Unable to authenticate with PayPal')
  }

  return data.access_token as string
}

export async function createPayPalOrder({
  orderId,
  total,
}: {
  orderId: string
  total: number
}) {
  const accessToken = await getAccessToken()
  const currency = process.env.PAYPAL_CURRENCY || 'INR'
  const amount = total.toFixed(2)

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          invoice_id: orderId.slice(0, 127),
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'InkTheory',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
          },
        },
      },
    }),
    cache: 'no-store',
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || data.details?.[0]?.description || 'Unable to create PayPal order')
  }

  return data
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    cache: 'no-store',
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || data.details?.[0]?.description || 'Unable to capture PayPal order')
  }

  return data
}
