// lib/quikink/client.ts
import axios, { AxiosInstance } from 'axios'

const QUIKINK_API_URL =
  process.env.QUIKINK_API_URL ||
  (process.env.QUIKINK_ENVIRONMENT === 'live'
    ? 'https://api.quikink.in/v1'
    : process.env.QUIKINK_SANDBOX_API_URL || 'https://sandbox.quikink.in/api/v1')
const QUIKINK_API_KEY = process.env.QUIKINK_API_KEY || ''
const QUIKINK_CLIENT_ID = process.env.QUIKINK_CLIENT_ID || ''
const QUIKINK_CLIENT_SECRET = process.env.QUIKINK_CLIENT_SECRET || ''

class QuikinkClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: QUIKINK_API_URL,
      headers: {
        'Authorization': `Bearer ${QUIKINK_API_KEY}`,
        ...(QUIKINK_CLIENT_ID && { 'X-Client-Id': QUIKINK_CLIENT_ID }),
        ...(QUIKINK_CLIENT_SECRET && { 'X-Client-Secret': QUIKINK_CLIENT_SECRET }),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[Quikink API Error]', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        })
        throw new Error(
          error.response?.data?.message || `Quikink API error: ${error.message}`
        )
      }
    )
  }

  // Fetch all products from Quikink catalog
  async getCatalog(page = 1, limit = 50) {
    const response = await this.client.get('/catalog/products', {
      params: { page, limit },
    })
    return response.data
  }

  // Fetch single product details with variants
  async getProduct(productId: string) {
    const response = await this.client.get(`/catalog/products/${productId}`)
    return response.data
  }

  // Fetch product variants
  async getVariants(productId: string) {
    const response = await this.client.get(`/catalog/products/${productId}/variants`)
    return response.data
  }

  // Fetch mockup images for a product
  async getMockups(productId: string, color?: string) {
    const response = await this.client.get(`/catalog/products/${productId}/mockups`, {
      params: color ? { color } : {},
    })
    return response.data
  }

  // Create an order in Quikink
  async createOrder(payload: {
    externalOrderId: string
    customer: {
      name: string
      email: string
      phone: string
    }
    shippingAddress: {
      line1: string
      line2?: string
      city: string
      state: string
      pincode: string
      country: string
    }
    items: Array<{
      skuId: string
      quantity: number
      price: number
    }>
  }) {
    const response = await this.client.post('/orders', payload)
    return response.data
  }

  // Get order status from Quikink
  async getOrderStatus(quikinkOrderId: string) {
    const response = await this.client.get(`/orders/${quikinkOrderId}`)
    return response.data
  }

  // Cancel an order
  async cancelOrder(quikinkOrderId: string, reason: string) {
    const response = await this.client.post(`/orders/${quikinkOrderId}/cancel`, {
      reason,
    })
    return response.data
  }

  // Get shipping rates
  async getShippingRates(payload: {
    pincode: string
    items: Array<{ skuId: string; quantity: number }>
  }) {
    const response = await this.client.post('/shipping/rates', payload)
    return response.data
  }
}

export const quikinkClient = new QuikinkClient()
