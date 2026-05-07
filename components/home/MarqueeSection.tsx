// components/home/MarqueeSection.tsx
export function MarqueeSection() {
  const items = [
    'PREMIUM STREETWEAR',
    'PRINT ON DEMAND',
    'FREE SHIPPING ABOVE ₹1500',
    'PAN INDIA DELIVERY',
    'LIMITED DROPS',
    'QUALITY GUARANTEED',
  ]

  return (
    <div className="bg-ink py-4 overflow-hidden border-y border-ink">
      <div className="marquee-inner">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-[4px] uppercase text-cream/50 mx-10 flex-shrink-0"
          >
            {item}
            <span className="mx-10 text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
