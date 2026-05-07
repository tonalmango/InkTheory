// components/animations/CustomCursor.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 80 })
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 80 })

  const ringX = useSpring(mouseX, { stiffness: 200, damping: 20 })
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 20 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !window.matchMedia('(pointer: fine)').matches) return

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!(el instanceof Element)) {
        setIsPointer(false)
        return
      }

      const pointer =
        el.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor="pointer"]') ||
        window.getComputedStyle(el).cursor === 'pointer'
      setIsPointer(!!pointer)
    }

    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)
    const leave = () => setIsHidden(true)
    const enter = () => setIsHidden(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [mounted, mouseX, mouseY])

  if (!mounted) return null

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-cream rounded-full pointer-events-none z-[9999] mix-blend-difference shadow-[0_0_10px_rgba(200,169,81,0.9)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 1,
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{ scale: { duration: 0.1 } }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-accent mix-blend-difference shadow-[0_0_0_1px_rgba(245,240,232,0.35),0_0_22px_rgba(200,169,81,0.45)]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 1,
          width: isPointer ? 48 : isClicking ? 28 : 36,
          height: isPointer ? 48 : isClicking ? 28 : 36,
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 } }}
      />
    </>
  )
}
