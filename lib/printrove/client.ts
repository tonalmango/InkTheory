import axios, { AxiosInstance } from 'axios'

const PRINTROVE_API_URL = process.env.PRINTROVE_API_URL || 'https://api.printrove.com'
const PRINTROVE_EMAIL = process.env.PRINTROVE_EMAIL || ''
const PRINTROVE_PASSWORD = process.env.PRINTROVE_PASSWORD || ''

type TokenResponse = {
  access_token: string
  expires_at?: string
}

export type PrintroveOrderPayload = {
  reference_number: string
  retail_price: number
  customer: {
    name: string
    email?: string
    number: number | string
    address1: string
    address2: string
    address3?: string
    pincode?: number | string
    state?: string
    city?: string
    country: string
  }
  order_products: Array<{
    product_id?: number
    variant_id?: number
    design?: {
      front?: {
        id: number
        dimensions: { width: number; height: number; top: number; left: number }
      }
      back?: {
        id: number
        dimensions: { width: number; height: number; top: number; left: number }
      }
    }
    quantity: number
    is_plain?: boolean
  }>
  courier_id?: number
  cod: boolean
  invoice_url?: string
}

class PrintroveClient {
  private client: AxiosInstance
  private token = ''
  private tokenExpiresAt = 0

  constructor() {
    this.client = axios.create({
      baseURL: PRINTROVE_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    })

    this.client.interceptors.request.use(async (config) => {
      const token = await this.getToken()
      config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[Printrove API Error]', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        })
        throw new Error(error.response?.data?.message || `Printrove API error: ${error.message}`)
      }
    )
  }

  private async getToken() {
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token
    }

    if (!PRINTROVE_EMAIL || !PRINTROVE_PASSWORD) {
      throw new Error('Set PRINTROVE_EMAIL and PRINTROVE_PASSWORD for Printrove authentication')
    }

    const response = await axios.post<TokenResponse>(
      `${PRINTROVE_API_URL}/api/external/token`,
      { email: PRINTROVE_EMAIL, password: PRINTROVE_PASSWORD },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
    )

    this.token = response.data.access_token
    this.tokenExpiresAt = response.data.expires_at
      ? new Date(response.data.expires_at).getTime() - 60_000
      : Date.now() + 60 * 60 * 1000

    return this.token
  }

  async getCategories() {
    const response = await this.client.get('/api/external/categories')
    return response.data
  }

  async getParentProducts(categoryId: string | number) {
    const response = await this.client.get(`/api/external/categories/${categoryId}`)
    return response.data
  }

  async getProductVariants(categoryId: string | number, parentSku: string | number) {
    const response = await this.client.get(`/api/external/categories/${categoryId}/products/${parentSku}`)
    return response.data
  }

  async createOrder(payload: PrintroveOrderPayload) {
    const response = await this.client.post('/api/external/orders', payload)
    return response.data
  }

  async getOrderStatus(printroveOrderId: string) {
    const response = await this.client.get(`/api/external/orders/${printroveOrderId}`)
    return response.data
  }

  async listOrders(params?: { reference_number?: string; tracking_number?: string }) {
    const response = await this.client.get('/api/external/orders', { params })
    return response.data
  }

  async listProducts(params?: { page?: string; per_page?: string; name?: string; sku?: string }) {
    const response = await this.client.get('/api/external/products', { params })
    return response.data
  }

  async getLibraryProduct(productId: string | number) {
    const response = await this.client.get(`/api/external/products/${productId}`)
    return response.data
  }

  async cancelOrder(printroveOrderId: string, reason: string) {
    const response = await this.client.post(`/api/external/orders/${printroveOrderId}/cancel`, { reason })
    return response.data
  }

  async getPincodeDetails(pincode: string) {
    const response = await this.client.get(`/api/external/pincode/${pincode}`)
    return response.data
  }

  async getServiceability(params: { country: string; pincode: string; weight: string; cod?: string }) {
    const response = await this.client.get('/api/external/serviceability', { params })
    return response.data
  }
}

export const printroveClient = new PrintroveClient()
