'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import type { Collection } from '@/lib/collections'
import { WorldShell, IntroTitle, SpecStrip, ProductReveal } from './shared'

/**
 * EMIRATI CULTURE — a golden journey. The video travels from Liwa's
 * dunes to the Dubai skyline; a waypoint tracker and Arabic calligraphy
 * ride along, framed in mashrabiya-inspired gold linework.
 */
export function EmiratiSection({ c, onEnter }: { c: Collection; onEnter?: (a: string) => void }) {
  return (
    <WorldShell c={c} heightVh={400} videoSrc="/media/scrub-scroll-emirati.mp4" onEnter={onEnter}>
      {(p) => (
        <>
          <GoldFrame progress={p} accent={c.accent} />
          <IntroTitle c={c} progress={p} />
          <Calligraphy progress={p} accent={c.accent} />
          <Waypoints progress={p} accent={c.accent} />
          <SpecStrip c={c} progress={p} align="left" window={[0.36, 0.46, 0.58, 0.66]} />
          <ProductReveal c={c} progress={p} align="right" />
        </>
      )}
    </WorldShell>
  )
}

/* thin geometric gold frame that breathes with scroll */
function GoldFrame({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.08, 0.18, 0.85, 0.95], [0, 0.55, 0.55, 0])
  const inset = useTransform(progress, [0.08, 0.3], [34, 20])
  const insetPx = useTransform(inset, (v) => `${v}px`)

  return (
    <motion.div
      style={{ opacity, top: insetPx, bottom: insetPx, left: insetPx, right: insetPx }}
      className="pointer-events-none absolute z-[5] hidden border md:block"
      aria-hidden="true"
    >
      <span className="absolute -left-px -top-px h-8 w-8 border-l-2 border-t-2" style={{ borderColor: accent }} />
      <span className="absolute -right-px -top-px h-8 w-8 border-r-2 border-t-2" style={{ borderColor: accent }} />
      <span className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2" style={{ borderColor: accent }} />
      <span className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2" style={{ borderColor: accent }} />
      <div className="absolute inset-0 border border-white/5" />
    </motion.div>
  )
}

/* large ghost calligraphy drifting behind the journey */
function Calligraphy({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.2, 0.32, 0.6, 0.7], [0, 0.16, 0.16, 0])
  const y = useTransform(progress, [0.2, 0.7], [60, -60])

  return (
    <motion.div
      style={{ opacity, y, color: accent }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[16vw] leading-none"
      aria-hidden="true"
    >
      ذهب الصحراء
    </motion.div>
  )
}

/* journey tracker — dunes → skyline */
function Waypoints({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.18, 0.26, 0.66, 0.74], [0, 1, 1, 0])
  const lineScale = useTransform(progress, [0.24, 0.62], [0, 1])
  const dunes = useTransform(progress, [0.38, 0.46], [1, 0.35])
  const skyline = useTransform(progress, [0.38, 0.46], [0.35, 1])

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-24 left-1/2 z-10 hidden w-full max-w-md -translate-x-1/2 select-none px-6 md:block"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em]">
        <motion.span style={{ opacity: dunes }} className="text-white">
          Liwa — Dunes
        </motion.span>
        <motion.span style={{ opacity: skyline }} className="text-white">
          Dubai — Skyline
        </motion.span>
      </div>
      <div className="mt-3 h-px w-full bg-white/15">
        <motion.div
          className="h-full origin-left"
          style={{ scaleX: lineScale, background: accent, boxShadow: `0 0 12px ${accent}` }}
        />
      </div>
      <div className="mt-3 text-center text-[10px] uppercase tracking-[0.4em] text-white/50">
        Heritage → Horizon
      </div>
    </motion.div>
  )
}
