// components/home/MarqueeSection.tsx
export function MarqueeSection() {
  const items = [
    'TOO ONLINE TO BE NORMAL',
    'NEW DROP LIVE NOW',
    'FREE SHIPPING ABOVE ₹1499',
    'JOIN THE CIRCLE',
    'MADE FOR THE INDIAN MAIN CHARACTER',
  ]

  return (
    <div className="bg-ink py-5 overflow-hidden border-y-2 border-saffron/20">
      <div className="marquee-inner">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-widest uppercase text-cream/60 mx-12 flex-shrink-0 hover:text-saffron transition-colors"
          >
            {item}
            <span className="mx-12 text-saffron">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
