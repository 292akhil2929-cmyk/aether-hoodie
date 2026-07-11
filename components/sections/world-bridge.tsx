'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'motion/react'
import type { Collection } from '@/lib/collections'

/**
 * WORLD BRIDGE — the transition between two worlds.
 * A scroll-driven interstitial: the outgoing accent dissolves, a skewed
 * light-band swipes through in the incoming accent, and the next world's
 * name glides across in giant outline type before its film begins.
 */
export function WorldBridge({
  from,
  to,
  onEnter,
}: {
  from: Collection
  to: Collection
  onEnter?: (accent: string) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // mirror to force the JS path — see note in sections/shared.tsx
  const scrollYProgress = useMotionValue(rawProgress.get())

  useMotionValueEvent(rawProgress, 'change', (v) => {
    scrollYProgress.set(v)
    if (ref.current) ref.current.dataset.p = v.toFixed(3)
    if (v > 0.02 && v < 0.98) onEnter?.(v < 0.5 ? from.accent : to.accent)
  })

  // ambient glow handoff
  const fromGlow = useTransform(scrollYProgress, [0, 0.55], [0.5, 0])
  const toGlow = useTransform(scrollYProgress, [0.45, 1], [0, 0.55])

  // skewed light band swipe
  const bandX = useTransform(scrollYProgress, [0.12, 0.88], ['-130%', '130%'])
  const bandOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0, 1, 1, 0])

  // giant outline name gliding the other way
  const nameX = useTransform(scrollYProgress, [0, 1], ['55%', '-55%'])
  const nameOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0])

  // center chapter label
  const labelOpacity = useTransform(scrollYProgress, [0.32, 0.45, 0.55, 0.68], [0, 1, 1, 0])
  const labelY = useTransform(scrollYProgress, [0.32, 0.68], [26, -26])
  const ruleScale = useTransform(scrollYProgress, [0.36, 0.6], [0, 1])

  return (
    <section
      ref={ref}
      aria-label={`${from.name} to ${to.name} transition`}
      className="relative"
      style={{ height: '150vh' }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        {/* accent glow handoff */}
        <motion.div
          style={{ opacity: fromGlow }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(70% 55% at 30% 60%, ${from.glow}, transparent 65%)` }}
          />
        </motion.div>
        <motion.div style={{ opacity: toGlow }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(70% 55% at 70% 45%, ${to.glow}, transparent 65%)` }}
          />
        </motion.div>

        {/* skewed light band */}
        <motion.div
          style={{ x: bandX, opacity: bandOpacity }}
          className="absolute inset-y-[-20%] left-0 w-[70vw] -skew-x-12"
          aria-hidden="true"
        >
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${to.accent}14 30%, ${to.accent}33 50%, ${to.accent}14 70%, transparent)`,
              boxShadow: `0 0 120px ${to.glow}`,
            }}
          />
        </motion.div>

        {/* giant outline name of the incoming world */}
        <motion.span
          style={{
            x: nameX,
            opacity: nameOpacity,
            WebkitTextStroke: `2px ${to.accent}55`,
            color: 'transparent',
          }}
          className="outline-fallback display pointer-events-none absolute select-none whitespace-nowrap text-[18vw] leading-none"
          aria-hidden="true"
        >
          {to.name.toUpperCase()}
        </motion.span>

        {/* chapter label */}
        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="relative z-10 flex flex-col items-center gap-4 text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">
            Next world
          </span>
          <span className="display text-3xl text-white sm:text-4xl">
            {to.index} — {to.name}
          </span>
          <motion.span
            className="h-px w-28 origin-center"
            style={{ scaleX: ruleScale, background: to.accent, boxShadow: `0 0 12px ${to.accent}` }}
          />
          <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: to.accent }}>
            {to.tag}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
