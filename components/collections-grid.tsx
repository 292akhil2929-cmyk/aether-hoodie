'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { collections } from '@/lib/collections'

function Card({
  c,
  onHover,
  large,
}: {
  c: (typeof collections)[number]
  onHover: (accent: string | null) => void
  large?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  const move = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * 16)
    rx.set(-(py - 0.5) * 16)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
    onHover(null)
  }

  const bg = c.mediaType === 'video' ? c.product.image : c.media

  return (
    <motion.a
      ref={ref}
      href={`#${c.id}`}
      data-cursor-hover
      onMouseMove={move}
      onMouseEnter={() => onHover(c.accent)}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 p-6 ${
        large ? 'md:col-span-2 md:row-span-2 md:min-h-[46rem]' : ''
      }`}
    >
      {/* image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={bg || '/placeholder.svg'}
          alt={c.name}
          className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* hover glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, ${c.glow}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex items-end justify-between">
        <div style={{ transform: 'translateZ(40px)' }}>
          <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: c.accent }}>
            {c.index} — {c.tag}
          </span>
          <h3 className={`display mt-2 ${large ? 'text-6xl md:text-7xl' : 'text-4xl'}`}>{c.name}</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
        </div>
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:rotate-45"
          style={{ borderColor: c.accent, color: c.accent }}
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </motion.a>
  )
}

export function CollectionsGrid({ onHover }: { onHover: (accent: string | null) => void }) {
  return (
    <section id="collections" className="relative mx-auto max-w-7xl px-4 py-32">
      <div className="mb-16 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          Five studies · one point of view
        </motion.span>
        <h2 className="display mt-4 flex flex-wrap justify-center gap-x-4 text-5xl text-chrome sm:text-7xl">
          {['FIND', 'YOUR', 'PIECE'].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, rotateX: -60 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' }}
              style={{ transformPerspective: 600 }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>

      <div className="grid auto-rows-[22rem] grid-cols-1 gap-5 md:grid-cols-3">
        <Card c={collections[0]} onHover={onHover} large />
        <Card c={collections[1]} onHover={onHover} />
        <Card c={collections[2]} onHover={onHover} />
        <Card c={collections[3]} onHover={onHover} />
        <Card c={collections[4]} onHover={onHover} />
      </div>
    </section>
  )
}
