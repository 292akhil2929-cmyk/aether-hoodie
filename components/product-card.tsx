'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { MagneticButton } from './magnetic-button'
import type { Collection } from '@/lib/collections'
import { useCart } from './cart'

const sizes = ['XS', 'S', 'M', 'L', 'XL']

export function ProductCard({ c }: { c: Collection }) {
  const [size, setSize] = useState('M')
  const [color, setColor] = useState(c.product.colors[0])
  const { addItem } = useCart()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  const move = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 18)
    rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 18)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      {/* visual */}
      <motion.div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
        className="glass relative aspect-square overflow-hidden rounded-[2rem]"
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 40%, ${c.glow}, transparent 65%)` }}
        />
        <motion.img
          key={color.value}
          src={c.product.image}
          alt={c.product.name}
          initial={{ opacity: 0.4, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 h-full w-full object-contain p-8 drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
          style={{ transform: 'translateZ(60px)' }}
        />
        <div className="absolute left-5 top-5 z-20 rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          {c.tag}
        </div>
      </motion.div>

      {/* details */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: c.accent }}>
          {c.name} Collection
        </span>
        <h3 className="display mt-3 text-5xl sm:text-6xl">{c.product.name}</h3>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{c.blurb}</p>

        <div className="mt-8">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Colorway — {color.name}
          </p>
          <div className="flex gap-3">
            {c.product.colors.map((col) => (
              <button
                key={col.value}
                data-cursor-hover
                onClick={() => setColor(col)}
                aria-label={col.name}
                className="relative h-9 w-9 rounded-full transition-transform duration-300 hover:scale-110"
                style={{
                  background: col.value,
                  boxShadow: color.value === col.value ? `0 0 0 2px ${c.accent}, 0 0 18px ${c.glow}` : 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                data-cursor-hover
                onClick={() => setSize(s)}
                className="relative h-11 w-11 overflow-hidden rounded-xl border text-sm font-medium transition-colors"
                style={{
                  borderColor: size === s ? c.accent : 'rgba(255,255,255,0.12)',
                  color: size === s ? '#050505' : 'var(--color-foreground)',
                }}
              >
                <span
                  className="absolute inset-0 -z-10 transition-transform duration-300"
                  style={{
                    background: c.accent,
                    transform: size === s ? 'scale(1)' : 'scale(0)',
                  }}
                />
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <span className="display text-4xl" style={{ color: c.accent }}>
            {c.product.price}
          </span>
          <MagneticButton accent={c.accent} variant="solid" onClick={() => addItem({ name: c.product.name, price: c.product.price, image: c.product.image, accent: c.accent })}>
            Add to selection
          </MagneticButton>
        </div>
      </div>
    </div>
  )
}
