// app/checkout/page.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Tag, Lock, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, calculateShipping, calculateTax } from '@/lib/utils'

interface Address {
  id: string
  name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        render: (selector: string) => Promise<void>
      }
    }
  }
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [addingAddress, setAddingAddress] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [paypalReady, setPaypalReady] = useState(false)
  const [paymentChoice, setPaymentChoice] = useState<'paypal' | 'card-upi'>('paypal')
  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const paypalButtonsRef = useRef<HTMLDivElement>(null)

  const subtotal = totalPrice()
  const discount = couponDiscount
  const shipping = calculateShipping(subtotal - discount)
  const tax = calculateTax(subtotal - discount)
  const total = subtotal - discount + shipping + tax

  useEffect(() => {
    if (!session) { router.push('/auth/signin?callbackUrl=/checkout'); return }
    if (items.length === 0) { router.push('/shop'); return }
    fetchAddresses()
  }, [session])

  useEffect(() => {
    if (!paypalReady || !paypalButtonsRef.current || !window.paypal) return
    paypalButtonsRef.current.innerHTML = ''

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: paymentChoice === 'paypal' ? 'gold' : 'black',
        shape: 'rect',
        label: paymentChoice === 'paypal' ? 'paypal' : 'pay',
      },
      createOrder: async () => {
        if (!selectedAddress) {
          toast.error('Please select a delivery address')
          throw new Error('Missing address')
        }

        setPlacing(true)
        const orderRes = await fetch('/api/checkout/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            addressId: selectedAddress,
            items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
            couponCode: couponCode || undefined,
          }),
        })

        const orderData = await orderRes.json()
        if (!orderRes.ok) {
          setPlacing(false)
          throw new Error(orderData.error || 'Order creation failed')
        }

        sessionStorage.setItem('inktheory_checkout_order_id', orderData.orderId)
        return orderData.paypalOrderId
      },
      onApprove: async (data: { orderID: string }) => {
        const orderId = sessionStorage.getItem('inktheory_checkout_order_id')
        const verifyRes = await fetch('/api/checkout/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paypalOrderId: data.orderID, orderId }),
        })

        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          clearCart()
          sessionStorage.removeItem('inktheory_checkout_order_id')
          toast.success('Order placed successfully!')
          router.push(`/account/orders/${verifyData.orderId}?success=true`)
        } else {
          setPlacing(false)
          toast.error(verifyData.error || 'Payment verification failed. Please contact support.')
        }
      },
      onCancel: () => {
        setPlacing(false)
        toast.error('Payment cancelled')
      },
      onError: (err: Error) => {
        setPlacing(false)
        toast.error(err.message || 'PayPal payment failed')
      },
    }).render('#paypal-buttons')
  }, [paypalReady, selectedAddress, items, couponCode, paymentChoice])

  const fetchAddresses = async () => {
    const res = await fetch('/api/addresses')
    const data = await res.json()
    setAddresses(data.addresses || [])
    if (data.addresses?.length > 0) setSelectedAddress(data.addresses[0].id)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        setCouponDiscount(data.discount)
        toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`)
      } else {
        toast.error(data.error || 'Invalid coupon')
        setCouponDiscount(0)
      }
    } finally {
      setCouponLoading(false)
    }
  }

  const handleSaveAddress = async () => {
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    })
    const data = await res.json()
    if (data.address) {
      setAddresses((prev) => [...prev, data.address])
      setSelectedAddress(data.address.id)
      setAddingAddress(false)
      toast.success('Address saved')
    }
  }

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test'}&currency=${process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'INR'}&intent=capture&components=buttons&enable-funding=card`}
        onReady={() => setPaypalReady(true)}
        onError={() => toast.error('Unable to load PayPal checkout')}
      />
      <div className="pt-20 md:pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="display-heading text-3xl md:text-4xl mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="font-mono text-sm tracking-[3px] uppercase mb-4">Delivery Address</h2>

                {addresses.map((addr) => (
                  <label key={addr.id}
                    className={`flex items-start gap-4 p-4 border mb-3 cursor-pointer transition-colors ${
                      selectedAddress === addr.id ? 'border-ink bg-cream-dark' : 'border-ink/20 hover:border-ink/40'
                    }`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)} className="mt-1" />
                    <div>
                      <p className="text-sm font-medium">{addr.name} · {addr.phone}</p>
                      <p className="text-sm text-smoke mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-sm text-smoke">{addr.city}, {addr.state} {addr.pincode}</p>
                    </div>
                  </label>
                ))}

                <button onClick={() => setAddingAddress(!addingAddress)}
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors font-mono">
                  <Plus size={14} /> Add New Address
                </button>

                {addingAddress && (
                  <motion.div className="mt-4 space-y-3 border border-ink/20 p-5"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    {[
                      { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
                      { key: 'phone', label: 'Phone', placeholder: '9876543210' },
                      { key: 'line1', label: 'Address Line 1', placeholder: 'House No., Street' },
                      { key: 'line2', label: 'Address Line 2 (optional)', placeholder: 'Landmark' },
                      { key: 'city', label: 'City', placeholder: 'Mumbai' },
                      { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                      { key: 'pincode', label: 'PIN Code', placeholder: '400001' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1">{label}</label>
                        <input value={(newAddress as any)[key]} onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                          placeholder={placeholder} className="input-field" />
                      </div>
                    ))}
                    <button onClick={handleSaveAddress} className="btn-primary text-xs py-3 w-full">
                      SAVE ADDRESS
                    </button>
                  </motion.div>
                )}
              </div>

              <div>
                <h2 className="font-mono text-sm tracking-[3px] uppercase mb-4">Promo Code</h2>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke" />
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER COUPON CODE"
                      className="input-field pl-9 font-mono tracking-widest text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()} />
                  </div>
                  <button onClick={handleApplyCoupon} disabled={couponLoading}
                    className="btn-secondary text-xs px-5 whitespace-nowrap">
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'APPLY'}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-cream-dark p-6 space-y-4 sticky top-24">
                <h2 className="font-mono text-sm tracking-[3px] uppercase">Order Summary</h2>

                <div className="space-y-3 border-b border-ink/10 pb-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-12 h-14 bg-cream overflow-hidden flex-shrink-0">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0]} alt={item.product.name}
                            width={48} height={56} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-smoke font-mono">{item.variant.size} · {item.variant.color}</p>
                        <p className="text-xs text-smoke">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium whitespace-nowrap">
                        {formatPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-smoke">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-smoke">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-smoke">
                    <span>GST (18%)</span><span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base border-t border-ink/10 pt-3">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-mono text-xs tracking-[3px] uppercase">Payment</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'paypal', label: 'PayPal' },
                      { id: 'card-upi', label: 'Cards / UPI' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentChoice(option.id as 'paypal' | 'card-upi')}
                        className={`border px-3 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                          paymentChoice === option.id
                            ? 'border-ink bg-ink text-cream'
                            : 'border-ink/20 text-smoke hover:border-ink/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div
                    id="paypal-buttons"
                    ref={paypalButtonsRef}
                    className={placing || !selectedAddress ? 'pointer-events-none opacity-60' : ''}
                  />
                  {!paypalReady && (
                    <div className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                      <Loader2 size={16} className="animate-spin" /> LOADING PAYPAL...
                    </div>
                  )}
                </div>

                <p className="text-xs text-smoke text-center font-mono">
                  <Lock size={12} className="inline mr-1" />
                  Secured by PayPal. Cards and UPI appear when enabled on your PayPal account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
