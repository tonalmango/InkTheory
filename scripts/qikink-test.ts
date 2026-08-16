import { loadEnvConfig } from '@next/env'
import { authenticate, createOrder } from '../lib/qikink'

loadEnvConfig(process.cwd())

function required(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name} in your environment`)
  return value
}

async function main() {
  try {
    const token = await authenticate()
    console.log('Authentication Success')
    console.log('Token Received')

    const result = await createOrder({
      orderNumber: `TEST${Date.now().toString().slice(-10)}`,
      customer: {
        firstName: required('QIKINK_TEST_FIRST_NAME'),
        lastName: process.env.QIKINK_TEST_LAST_NAME,
        email: required('QIKINK_TEST_EMAIL'),
        phone: required('QIKINK_TEST_PHONE'),
      },
      shippingAddress: {
        address1: required('QIKINK_TEST_ADDRESS1'),
        address2: process.env.QIKINK_TEST_ADDRESS2,
        city: required('QIKINK_TEST_CITY'),
        state: required('QIKINK_TEST_STATE'),
        pincode: required('QIKINK_TEST_PINCODE'),
      },
      products: [{
        sku: required('QIKINK_TEST_SKU'),
        quantity: Number(process.env.QIKINK_TEST_QUANTITY || '1'),
        price: Number(required('QIKINK_TEST_PRICE')),
        printFiles: [{
          designCode: required('QIKINK_TEST_DESIGN_CODE'),
          designLink: required('QIKINK_TEST_DESIGN_LINK'),
          mockupLink: required('QIKINK_TEST_MOCKUP_LINK'),
          placementSku: process.env.QIKINK_TEST_PLACEMENT || 'fr',
        }],
      }],
    })

    console.log('Order Created Successfully')
    console.log(`Order ID: ${result.orderId}`)
  } catch (error) {
    console.error('Qikink Sandbox test failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}

main()
