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
