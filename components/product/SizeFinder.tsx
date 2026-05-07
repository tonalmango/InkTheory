// components/product/SizeFinder.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler } from 'lucide-react'
import { recommendSize, SizeChartEntry } from '@/lib/ai/sizeRecommender'

interface Props {
  isOpen: boolean
  onClose: () => void
  sizeChart: SizeChartEntry[]
  onSelect: (size: string) => void
}

export function SizeFinder({ isOpen, onClose, sizeChart, onSelect }: Props) {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [fit, setFit] = useState<'slim' | 'regular' | 'oversized'>('regular')
  const [result, setResult] = useState<ReturnType<typeof recommendSize> | null>(null)

  const handleFind = () => {
    if (!height || !weight) return
    const res = recommendSize(
      { heightCm: Number(height), weightKg: Number(weight), fitPreference: fit },
      sizeChart
    )
    setResult(res)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-ink/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-cream z-50 max-w-md mx-auto p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-accent" />
                <h3 className="font-mono text-sm tracking-[3px] uppercase">Size Finder</h3>
              </div>
              <button onClick={onClose}><X size={20} className="text-smoke hover:text-ink" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">
                    Height (cm)
                  </label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175" className="input-field" min="140" max="220" />
                </div>
                <div>
                  <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">
                    Weight (kg)
                  </label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70" className="input-field" min="30" max="150" />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">
                  Fit Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slim', 'regular', 'oversized'] as const).map((f) => (
                    <button key={f} onClick={() => setFit(f)}
                      className={`py-2.5 text-xs font-mono capitalize border transition-colors ${
                        fit === f ? 'bg-ink text-cream border-ink' : 'border-ink/20 text-smoke hover:border-ink'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleFind}
                className="w-full btn-primary py-3 text-xs">
                FIND MY SIZE
              </button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div className="mt-6 border border-accent/30 bg-accent/5 p-5"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-xs font-mono text-smoke tracking-widest uppercase mb-1">Recommended Size</p>
                  <p className="font-display text-5xl text-ink mb-2">{result.recommendedSize}</p>
                  <p className="text-sm text-smoke">{result.reason}</p>
                  {result.alternateSize && (
                    <p className="text-xs text-smoke mt-1">
                      Also consider: <span className="font-medium text-ink">{result.alternateSize}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-ink/10 h-1 rounded">
                      <div className="bg-accent h-1 rounded" style={{ width: `${result.confidence * 100}%` }} />
                    </div>
                    <span className="text-xs text-smoke font-mono">{Math.round(result.confidence * 100)}% match</span>
                  </div>
                  <button onClick={() => onSelect(result.recommendedSize)}
                    className="w-full btn-accent py-2.5 text-xs mt-4">
                    SELECT {result.recommendedSize}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Size chart table */}
            {sizeChart.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-mono text-smoke tracking-widest uppercase mb-3">Size Chart (inches)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center">
                    <thead>
                      <tr className="border-b border-ink/10">
                        {['Size', 'Chest', 'Length', 'Shoulder'].map((h) => (
                          <th key={h} className="py-2 font-mono text-smoke tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.map((row) => (
                        <tr key={row.size} className={`border-b border-ink/5 ${result?.recommendedSize === row.size ? 'bg-accent/10' : ''}`}>
                          <td className="py-2 font-medium">{row.size}</td>
                          <td className="py-2 text-smoke">{row.chest}"</td>
                          <td className="py-2 text-smoke">{row.length}"</td>
                          <td className="py-2 text-smoke">{row.shoulder}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
