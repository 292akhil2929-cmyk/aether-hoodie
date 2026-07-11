'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import type { Collection } from '@/lib/collections'
import { WorldShell, IntroTitle, ProductReveal } from './shared'

/**
 * FIFA WORLD CUP — the stadium reveal. A scoreboard clock ticks toward
 * the final whistle as you scroll; floodlight sweeps rake the dark and
 * the numbered, sealed drop is unveiled under the lights.
 */
export function FifaSection({ c, onEnter }: { c: Collection; onEnter?: (a: string) => void }) {
  return (
    <WorldShell c={c} heightVh={420} videoSrc="/media/scrub-scroll-fifa.mp4" onEnter={onEnter}>
      {(p) => (
        <>
          <IntroTitle c={c} progress={p} />
          <Floodlights progress={p} />
          <Scoreboard progress={p} accent={c.accent} />
          <EditionCounter progress={p} accent={c.accent} />
          <ProductReveal c={c} progress={p} align="left" />
        </>
      )}
    </WorldShell>
  )
}

/* scoreboard — match clock driven by scroll, final-whistle framing */
function Scoreboard({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.16, 0.24, 0.62, 0.7], [0, 1, 1, 0])
  const minutes = useTransform(progress, [0.2, 0.6], [88, 94])
  const clock = useTransform(minutes, (v) => {
    const m = Math.min(90, Math.floor(v))
    const added = Math.max(0, Math.floor(v) - 90)
    return added > 0 ? `90+${added}'` : `${m}'`
  })

  return (
    <motion.div
      style={{ opacity }}
      className="glass absolute top-[14%] left-1/2 z-10 -translate-x-1/2 select-none rounded-2xl px-7 py-4 text-center font-mono"
      aria-hidden="true"
    >
      <div className="flex items-center gap-6">
        <span className="text-sm font-bold tracking-widest text-white">ÆTHER</span>
        <motion.span className="text-3xl font-bold tabular-nums" style={{ color: accent }}>
          {clock}
        </motion.span>
        <span className="text-sm font-bold tracking-widest text-white">WORLD</span>
      </div>
      <div className="mt-1 text-[9px] uppercase tracking-[0.4em] text-white/50">
        The Final — Drop at the whistle
      </div>
    </motion.div>
  )
}

/* floodlight sweeps raking across the dark */
function Floodlights({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.24, 0.34, 0.58, 0.68], [0, 0.5, 0.5, 0])
  const sweep = useTransform(progress, [0.24, 0.68], [-25, 25])
  const rotate1 = useTransform(sweep, (v) => `${18 + v}deg`)
  const rotate2 = useTransform(sweep, (v) => `${-18 - v}deg`)

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ rotate: rotate1 }}
        className="absolute -top-1/4 left-[12%] h-[150vh] w-40 origin-top bg-gradient-to-b from-white/25 via-white/8 to-transparent blur-xl"
      />
      <motion.div
        style={{ rotate: rotate2 }}
        className="absolute -top-1/4 right-[12%] h-[150vh] w-40 origin-top bg-gradient-to-b from-white/25 via-white/8 to-transparent blur-xl"
      />
    </motion.div>
  )
}

/* numbered edition ticker */
function EditionCounter({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.36, 0.44, 0.6, 0.68], [0, 1, 1, 0])
  const num = useTransform(progress, [0.36, 0.6], [1, 426])
  const numText = useTransform(num, (v) => `${Math.round(v)}`.padStart(4, '0'))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-28 right-6 z-10 hidden select-none text-right font-mono sm:right-16 md:block"
      aria-hidden="true"
    >
      <span className="block text-[10px] uppercase tracking-[0.4em] text-white/50">Numbered · Sealed</span>
      <div className="mt-1 flex items-baseline justify-end gap-2">
        <motion.span className="text-6xl font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 30px ${accent}66` }}>
          {numText}
        </motion.span>
        <span className="text-xl text-white/60">/ 2026</span>
      </div>
      <span className="mt-1 block text-[10px] uppercase tracking-[0.4em] text-white/50">Unrepeatable</span>
    </motion.div>
  )
}
