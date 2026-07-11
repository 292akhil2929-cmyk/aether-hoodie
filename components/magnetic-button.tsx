'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function MagneticButton({
  children,
  accent,
  variant = 'solid',
  onClick,
  className = '',
}: {
  children: ReactNode
  accent: string
  variant?: 'solid' | 'ghost'
  onClick?: () => void
  className?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    x.set(mx * 0.35)
    y.set(my * 0.35)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const isSolid = variant === 'solid'

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      data-cursor-hover
      className={`group relative overflow-hidden rounded-full px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors ${className}`}
    >
      <span
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background: isSolid ? accent : 'transparent',
          border: isSolid ? 'none' : `1px solid ${accent}`,
          boxShadow: isSolid ? `0 0 40px ${accent}55` : 'none',
        }}
      />
      <span
        className="absolute inset-0 -z-10 translate-y-full rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0"
        style={{ background: isSolid ? '#fff' : accent }}
      />
      <span
        className="relative z-10 transition-colors duration-500 group-hover:!text-[#050505]"
        style={{ color: isSolid ? '#050505' : accent }}
      >
        {children}
      </span>
    </motion.button>
  )
}
