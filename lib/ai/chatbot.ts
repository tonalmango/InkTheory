// lib/ai/chatbot.ts
// PLACEHOLDER: Future AI-powered customer support chatbot

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatContext {
  userId?: string
  orderId?: string
  productId?: string
}

/**
 * Rule-based FAQ responder (placeholder for AI chatbot)
 * TODO: Replace with Claude/GPT integration with RAG over product catalog + FAQ docs
 */
export function getRuleBasedResponse(message: string, context?: ChatContext): string {
  const lower = message.toLowerCase()

  if (lower.includes('track') || lower.includes('order status')) {
    if (context?.orderId) {
      return `To track your order ${context.orderId}, visit your Account > Orders page for real-time updates.`
    }
    return 'Visit your Account Dashboard > Orders to track all your orders.'
  }

  if (lower.includes('return') || lower.includes('refund')) {
    return 'We offer hassle-free returns within 7 days of delivery. Visit Account > Orders and click "Return/Refund" on the relevant order.'
  }

  if (lower.includes('size') || lower.includes('fit')) {
    return 'Use our Size Finder tool on any product page to enter your height and weight for an accurate recommendation.'
  }

  if (lower.includes('shipping') || lower.includes('delivery')) {
    return 'We ship across India in 5-7 business days. Express shipping is available at checkout.'
  }

  if (lower.includes('payment') || lower.includes('pay')) {
    return 'We accept PayPal checkout, plus cards and UPI where they are enabled on your PayPal account.'
  }

  if (lower.includes('coupon') || lower.includes('discount')) {
    return 'Apply coupon codes at checkout. Follow us on Instagram @inktheory.in for exclusive discount codes.'
  }

  return "I'm here to help! You can ask me about orders, sizing, shipping, returns, or payments."
}
