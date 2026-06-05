export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-28 h-28">
          <div className="absolute left-1/2 top-2 -translate-x-1/2 w-12 h-6 border-2 border-ink/70 border-b-0 rounded-t-full" />
          <div className="absolute inset-x-5 top-8 h-16 bg-ink rounded-t-[28px] overflow-hidden shadow-xl">
            <div className="absolute left-0 top-0 w-6 h-8 bg-cream rounded-br-full" />
            <div className="absolute right-0 top-0 w-6 h-8 bg-cream rounded-bl-full" />
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-8 h-5 border border-cream/25 border-t-0 rounded-b-full" />
            <div className="absolute inset-x-3 top-8 h-px bg-accent/70 animate-pulse" />
            <div className="absolute inset-x-4 top-11 h-px bg-cream/30 animate-pulse" />
            <div className="absolute inset-x-7 top-14 h-px bg-accent/60 animate-pulse" />
          </div>
          <div className="absolute inset-0 border border-accent/20 rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-display text-2xl text-ink">Loading the lore</p>
          <p className="font-mono text-[10px] tracking-[4px] uppercase text-smoke mt-2">InkTheory</p>
        </div>
      </div>
    </div>
  )
}
