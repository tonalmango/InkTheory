export interface QikinkPrintFile {
  designCode: string
  designLink: string
  mockupLink: string
  placementSku: 'fr' | 'bk' | string
  widthInches?: number
  heightInches?: number
}

export interface QikinkOrderProduct {
  sku: string
  quantity: number
  price: number
  printTypeId?: number
  printFiles?: QikinkPrintFile[]
}

export interface QikinkCustomer {
  firstName: string
  lastName?: string
  email: string
  phone: string
}

export interface QikinkShippingAddress {
  address1: string
  address2?: string
  city: string
  state: string
  pincode: string
  countryCode?: string
}

export interface CreateQikinkOrderInput {
  orderNumber: string
  customer: QikinkCustomer
  shippingAddress: QikinkShippingAddress
  products: QikinkOrderProduct[]
  paymentMethod?: 'prepaid' | 'cod'
  totalOrderValue?: number
}

export interface QikinkOrderResponse {
  orderId: string
  status: string
  response: Record<string, unknown>
}

export class QikinkApiError extends Error {
  constructor(message: string, public readonly status?: number, public readonly response?: unknown) {
    super(message)
    this.name = 'QikinkApiError'
  }
}

