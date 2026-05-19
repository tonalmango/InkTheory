// types/index.ts
export type Category =
  | 'PRINTED_TSHIRT'
  | 'OVERSIZED_TEE'
  | 'HOODIE'
  | 'SWEATSHIRT'
  | 'CAP'
  | 'ACCESSORY'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface ProductVariant {
  id: string
  productId: string
  printroveSkuId?: string | null
  size: string
  color: string
  colorHex?: string | null
  stock: number
  price: number
  isAvailable: boolean
}

export interface SizeChartEntry {
  size: string
  chest: number
  length: number
  shoulder: number
  minHeight: number
  maxHeight: number
  minWeight: number
  maxWeight: number
}

export interface Product {
  id: string
  printroveId?: string | null
  name: string
  slug: string
  description: string
  category: Category
  tags: string[]
  basePrice: number
  comparePrice?: number | null
  images: string[]
  mockupImages: string[]
  isActive: boolean
  isFeatured: boolean
  isTrending: boolean
  variants: ProductVariant[]
  sizeChart?: { data: SizeChartEntry[] } | null
  reviews?: Review[]
  _count?: { reviews: number }
  avgRating?: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  variantId: string
  quantity: number
  product: Product
  variant: ProductVariant
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
}

export interface Address {
  id: string
  userId: string
  name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId: string
  quantity: number
  price: number
  name: string
  image: string
  size: string
  color: string
}

export interface Order {
  id: string
  userId: string
  addressId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paypalOrderId?: string | null
  paypalCaptureId?: string | null
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  items: OrderItem[]
  address: Address
  printrove?: PrintroveTracking | null
  createdAt: string
  updatedAt: string
}

export interface PrintroveTracking {
  id: string
  orderId: string
  printroveOrderId?: string | null
  status: string
  trackingNumber?: string | null
  trackingUrl?: string | null
  carrier?: string | null
}

export interface Coupon {
  id: string
  code: string
  type: DiscountType
  value: number
  minOrderValue: number
  maxUses?: number | null
  usedCount: number
  isActive: boolean
  expiresAt?: string | null
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string | null
  body?: string | null
  isVerified: boolean
  user?: { name: string | null; image: string | null }
  createdAt: string
}

// Printrove API types
export interface PrintroveProduct {
  id: string
  name: string
  description: string
  category: string
  variants: PrintroveVariant[]
  images: string[]
  mockupImages: string[]
  basePrice: number
}

export interface PrintroveVariant {
  id: string
  size: string
  color: string
  colorHex: string
  price: number
  stock: number
}

export interface PrintroveOrderPayload {
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
    city: string
    country: string
  }
  order_products: {
    product_id?: number
    variant_id?: number
    quantity: number
    is_plain?: boolean
  }[]
  courier_id?: number
  cod: boolean
  invoice_url?: string
}

// Cart store types
export interface LocalCartItem {
  productId: string
  variantId: string
  quantity: number
  product: Pick<Product, 'id' | 'name' | 'images' | 'slug'>
  variant: Pick<ProductVariant, 'id' | 'size' | 'color' | 'price'>
}
