// lib/utils/index.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    PRINTED_TSHIRT: 'Printed T-Shirts',
    OVERSIZED_TEE: 'Oversized Tees',
    HOODIE: 'Hoodies',
    SWEATSHIRT: 'Sweatshirts',
    CAP: 'Caps',
    ACCESSORY: 'Accessories',
  }
  return labels[cat] || cat
}

export function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  }
  return labels[status] || status
}

export function orderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'text-saffron bg-saffron/10',
    CONFIRMED: 'text-bollywood bg-bollywood/10',
    PROCESSING: 'text-saffron bg-saffron/10',
    SHIPPED: 'text-royal-blue bg-royal-blue/10',
    DELIVERED: 'text-bollywood bg-bollywood/10',
    CANCELLED: 'text-red-600 bg-red-50',
    REFUNDED: 'text-gray-600 bg-gray-50',
  }
  return colors[status] || 'text-gray-600 bg-gray-50'
}

export function generateOrderId(): string {
  return `INK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
}

export function validatePincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode)
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

export function calculateShipping(subtotal: number): number {
  if (subtotal >= 1500) return 0 // Free above ₹1500
  return 99
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.18) // 18% GST
}

export function applyCoupon(
  subtotal: number,
  coupon: { type: string; value: number; minOrderValue: number }
): number {
  if (subtotal < coupon.minOrderValue) return 0
  if (coupon.type === 'PERCENTAGE') {
    return Math.min(Math.round((subtotal * coupon.value) / 100), subtotal)
  }
  return Math.min(coupon.value, subtotal)
}
