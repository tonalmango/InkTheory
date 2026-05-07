// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'error' | 'warning' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default:  'bg-ink text-cream',
  accent:   'bg-accent text-ink',
  success:  'bg-green-50 text-green-700',
  error:    'bg-red-50 text-red-700',
  warning:  'bg-yellow-50 text-yellow-700',
  outline:  'border border-ink/30 text-ink bg-transparent',
}

const sizes = {
  sm: 'text-[10px] tracking-[2px] px-2 py-0.5',
  md: 'text-xs tracking-[2px] px-3 py-1',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-mono uppercase rounded-sm leading-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
