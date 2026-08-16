import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { getQikinkConfig } from './config'
import { qikinkClient } from './client'
import type { CreateQikinkOrderInput, QikinkOrderResponse } from './types'
import { QikinkApiError } from './types'

function money(value: number) { return value.toFixed(2) }
function orderNumber(value: string) { return `IT${value.replace(/[^a-zA-Z0-9]/g, '').slice(-13)}`.slice(0, 15) }

export async function createOrder(input: CreateQikinkOrderInput): Promise<QikinkOrderResponse> {
  if (!input.products.length) throw new QikinkApiError('A Qikink order needs at least one product')
  const { environment } = getQikinkConfig()
  const total = input.totalOrderValue ?? input.products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const sandbox = environment === 'sandbox'

  const payload = {
    order_number: orderNumber(input.orderNumber),
    qikink_shipping: '1',
    gateway: input.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    total_order_value: money(total),
    line_items: input.products.map((product) => ({
      search_from_my_products: sandbox ? 0 : 1,
      sku: product.sku,
      quantity: String(product.quantity),
      price: money(product.price),
      ...(sandbox ? {
        print_type_id: product.printTypeId ?? 1,
        designs: (product.printFiles || []).map((file) => ({
          design_code: file.designCode,
          width_inches: String(file.widthInches ?? 10),
          height_inches: String(file.heightInches ?? 10),
          placement_sku: file.placementSku,
          design_link: file.designLink,
          mockup_link: file.mockupLink,
        })),
      } : {}),
    })),
    shipping_address: {
      first_name: input.customer.firstName,
      last_name: input.customer.lastName || '',
      address1: input.shippingAddress.address1,
      address2: input.shippingAddress.address2 || '',
      phone: input.customer.phone,
      email: input.customer.email,
      city: input.shippingAddress.city,
      zip: input.shippingAddress.pincode,
      province: input.shippingAddress.state,
      country_code: input.shippingAddress.countryCode || 'IN',
    },
  }

  if (sandbox && input.products.some((product) => !product.printFiles?.length)) {
    throw new QikinkApiError('Sandbox orders require print files for every product')
  }

  const response = await qikinkClient.post<Record<string, unknown>>('/api/order/create', payload)
  const orderId = response.order_id ?? response.orderId ?? response.id
  if (typeof orderId !== 'string' && typeof orderId !== 'number') {
    throw new QikinkApiError(String(response.message || 'Qikink did not return an order ID'), undefined, response)
  }
  return { orderId: String(orderId), status: String(response.status || response.message || 'SUBMITTED'), response }
}

export async function submitOrderToQikink(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, address: true, items: { include: { product: true, variant: true } } },
  })
  if (!order) throw new Error('Order not found')
  if (!order.user.email) throw new Error('A customer email is required for fulfillment')

  const result = await createOrder({
    orderNumber: order.id,
    customer: {
      firstName: order.address.name.split(/\s+/)[0] || order.address.name,
      lastName: order.address.name.split(/\s+/).slice(1).join(' '),
      email: order.user.email,
      phone: order.address.phone,
    },
    shippingAddress: { address1: order.address.line1, address2: order.address.line2 || undefined, city: order.address.city, state: order.address.state, pincode: order.address.pincode },
    products: order.items.map((item) => {
      const printFile = item.product.mockupImages[0] || item.product.images[0]
      if (!item.variant.fulfillmentSku) throw new Error(`Missing fulfillment SKU for ${item.name}`)
      return {
        sku: item.variant.fulfillmentSku,
        quantity: item.quantity,
        price: item.price,
        printFiles: printFile ? [{ designCode: item.product.slug, designLink: printFile, mockupLink: printFile, placementSku: 'fr' }] : [],
      }
    }),
    totalOrderValue: order.total,
  })

  await prisma.fulfillmentOrder.upsert({
    where: { orderId },
    create: { orderId, providerOrderId: result.orderId, status: result.status, rawResponse: result.response as Prisma.InputJsonValue },
    update: { providerOrderId: result.orderId, status: result.status, rawResponse: result.response as Prisma.InputJsonValue },
  })
  return result
}
