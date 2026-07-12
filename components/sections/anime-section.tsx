'use client'

import { useMemo } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import type { Collection } from '@/lib/collections'
import { WorldShell, IntroTitle, SpecStrip, ProductReveal } from './shared'

/**
 * ANIME — reality repaints itself in neon ink as you scroll.
 * Vertical katakana rails, drifting sakura petals and a phase label
 * that flips from REALITY to ANIME at the moment the video transforms.
 */
export function AnimeSection({ c, onEnter }: { c: Collection; onEnter?: (a: string) => void }) {
  return (
    <WorldShell c={c} heightVh={400} videoSrc="/media/scrub-scroll-anime.mp4" onEnter={onEnter}>
      {(p) => (
        <>
          <IntroTitle c={c} progress={p} />
          <KatakanaRails progress={p} accent={c.accent} />
          <PhaseLabel progress={p} accent={c.accent} />
          <Sakura progress={p} />
          <SpecStrip c={c} progress={p} align="right" window={[0.34, 0.44, 0.56, 0.64]} />
          <ProductReveal c={c} progress={p} align="right" />
        </>
      )}
    </WorldShell>
  )
}

/* vertical neon glyph rails on both edges */
function KatakanaRails({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.12, 0.2, 0.78, 0.86], [0, 0.85, 0.85, 0])
  const yLeft = useTransform(progress, [0, 1], ['6%', '-14%'])
  const yRight = useTransform(progress, [0, 1], ['-10%', '10%'])

  const rail = 'アイデンティティ・オーラ・ロニン・エーテル'

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[5] hidden md:block" aria-hidden="true">
      <motion.div
        style={{ y: yLeft, writingMode: 'vertical-rl', textShadow: `0 0 18px ${accent}` }}
        className="absolute left-5 top-0 text-xl tracking-[0.6em] text-white/70"
      >
        {rail}
      </motion.div>
      <motion.div
        style={{ y: yRight, writingMode: 'vertical-rl', color: accent, textShadow: `0 0 18px ${accent}` }}
        className="absolute right-5 top-0 text-xl tracking-[0.6em] opacity-80"
      >
        {rail}
      </motion.div>
    </motion.div>
  )
}

/* REALITY → ANIME phase flip, synced to the video's transformation */
function PhaseLabel({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const shellOpacity = useTransform(progress, [0.2, 0.26, 0.6, 0.68], [0, 1, 1, 0])
  const realityOpacity = useTransform(progress, [0.34, 0.42], [1, 0])
  const animeOpacity = useTransform(progress, [0.38, 0.46], [0, 1])
  const animeGlow = useTransform(progress, [0.38, 0.5], [0, 1])
  const glowShadow = useTransform(animeGlow, (v) => `0 0 ${v * 34}px ${accent}`)

  return (
    <motion.div
      style={{ opacity: shellOpacity }}
      className="absolute left-1/2 top-[18%] z-10 -translate-x-1/2 select-none text-center"
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">Crossing over</span>
      <div className="relative mt-2 h-14">
        <motion.span
          style={{ opacity: realityOpacity }}
          className="display absolute inset-x-0 text-5xl text-white/85"
        >
          REALITY
        </motion.span>
        <motion.span
          style={{ opacity: animeOpacity, color: accent, textShadow: glowShadow }}
          className="display absolute inset-x-0 text-5xl"
        >
          アニメ
        </motion.span>
      </div>
    </motion.div>
  )
}

/* drifting sakura petals, visible once the anime world takes over */
function Sakura({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.36, 0.46, 0.82, 0.92], [0, 1, 1, 0])
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 53) % 100,
        size: 6 + ((i * 7) % 9),
        delay: (i * 0.7) % 8,
        duration: 9 + ((i * 3) % 7),
        drift: i % 2 ? 40 : -40,
      })),
    [],
  )

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true">
      {petals.map((pt, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${pt.left}%`,
            top: '-4%',
            width: pt.size,
            height: pt.size * 0.8,
            background: 'linear-gradient(135deg, rgba(255,183,213,0.9), rgba(255,120,180,0.5))',
            animation: `sakura-fall ${pt.duration}s linear ${pt.delay}s infinite`,
            ['--drift' as string]: `${pt.drift}px`,
          }}
        />
      ))}
    </motion.div>
  )
}
