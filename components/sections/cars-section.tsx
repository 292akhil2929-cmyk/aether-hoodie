'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import type { Collection } from '@/lib/collections'
import { WorldShell, IntroTitle, ProductReveal } from './shared'
import { ScrollVideo } from '../scroll-video'

/**
 * EXOTIC CARS — a two-act cinematic.
 * Act I  (0 → 0.5): the LaFerrari glides into the luxury plaza (smooth entry).
 * Act II (0.5 → 1): crossfade — the machine rotates over the hoodie.
 * Both acts are scroll-scrubbed; the handoff happens mid-scroll.
 */
export function CarsSection({ c, onEnter }: { c: Collection; onEnter?: (a: string) => void }) {
  return (
    <WorldShell
      c={c}
      heightVh={520}
      onEnter={onEnter}
      background={(p) => <TwoActBackdrop progress={p} />}
    >
      {(p) => (
        <>
          <IntroTitle c={c} progress={p} out={0.16} />
          <ActLabel progress={p} />
          <ChromeSpecs progress={p} accent={c.accent} />
          <ProductReveal c={c} progress={p} align="left" from={0.72} />
        </>
      )}
    </WorldShell>
  )
}

/* two scrubbed videos with a mid-scroll crossfade */
function TwoActBackdrop({ progress }: { progress: MotionValue<number> }) {
  // act I consumes the first half of the runway, act II the second
  const p1 = useTransform(progress, [0, 0.5], [0, 1], { clamp: true })
  const p2 = useTransform(progress, [0.5, 1], [0, 1], { clamp: true })
  const fade = useTransform(progress, [0.46, 0.54], [0, 1])

  return (
    <div className="absolute inset-0">
      <ScrollVideo
        src="/media/scrub-scroll-f1-plaza.mp4"
        progress={p1}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.div style={{ opacity: fade }} className="absolute inset-0">
        <ScrollVideo
          src="/media/scrub-scroll-cars.mp4"
          progress={p2}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  )
}

/* act marker — top center, switches at the crossfade */
function ActLabel({ progress }: { progress: MotionValue<number> }) {
  const shellOpacity = useTransform(progress, [0.16, 0.22, 0.66, 0.72], [0, 1, 1, 0])
  const act1 = useTransform(progress, [0.44, 0.5], [1, 0])
  const act2 = useTransform(progress, [0.5, 0.56], [0, 1])

  return (
    <motion.div
      style={{ opacity: shellOpacity }}
      className="absolute left-1/2 top-[16%] z-10 -translate-x-1/2 select-none text-center"
      aria-hidden="true"
    >
      <div className="relative h-10 w-72">
        <motion.div style={{ opacity: act1 }} className="absolute inset-x-0">
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">Act I</span>
          <div className="display text-2xl text-chrome">THE ARRIVAL</div>
        </motion.div>
        <motion.div style={{ opacity: act2 }} className="absolute inset-x-0">
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">Act II</span>
          <div className="display text-2xl text-chrome">THE ROTATION</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* chrome spec chips appearing along the run */
function ChromeSpecs({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const specs = [
    { at: [0.24, 0.3, 0.4, 0.46] as const, big: '963 CV', sub: 'V12 hybrid powertrain' },
    { at: [0.34, 0.4, 0.48, 0.53] as const, big: '2.4s', sub: '0 — 100 km/h' },
    { at: [0.56, 0.62, 0.68, 0.73] as const, big: '360°', sub: 'Mirror-polished, every angle' },
  ]

  return (
    <>
      {specs.map((s, i) => {
        const right = i % 2 === 1
        return <Chip key={s.big} progress={progress} accent={accent} at={s.at} big={s.big} sub={s.sub} right={right} idx={i} />
      })}
    </>
  )
}

function Chip({
  progress,
  accent,
  at,
  big,
  sub,
  right,
  idx,
}: {
  progress: MotionValue<number>
  accent: string
  at: readonly [number, number, number, number]
  big: string
  sub: string
  right?: boolean
  idx: number
}) {
  const opacity = useTransform(progress, at as unknown as number[], [0, 1, 1, 0])
  const y = useTransform(progress, [at[0], at[1]], [40, 0])

  return (
    <motion.div
      style={{ opacity, y, top: `${30 + idx * 14}%` }}
      className={`glass absolute z-10 rounded-2xl px-6 py-4 ${right ? 'right-6 sm:right-16' : 'left-6 sm:left-16'}`}
    >
      <div className="display text-4xl" style={{ color: accent }}>
        {big}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/60">{sub}</div>
    </motion.div>
  )
}
