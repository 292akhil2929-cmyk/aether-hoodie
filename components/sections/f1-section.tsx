'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react'
import type { Collection } from '@/lib/collections'
import { WorldShell, IntroTitle } from './shared'
import { ScrollVideo } from '../scroll-video'

const ModelViewer = dynamic(() => import('../model-viewer'), { ssr: false })

/**
 * FORMULA 1 — two acts.
 * Act I  (0 → ~0.55): the LaFerrari tears down the runway, scroll-scrubbed
 *        (only the driving segment of the film — no morph), with a live
 *        telemetry HUD reading off scroll.
 * Act II (~0.55 → 1): the paddock goes dark and the drop is presented on a
 *        lit stage — the hoodie in interactive 3D, drag to inspect.
 */
export function F1Section({ c, onEnter }: { c: Collection; onEnter?: (a: string) => void }) {
  return (
    <WorldShell
      c={c}
      heightVh={460}
      onEnter={onEnter}
      background={(p) => <DriveBackdrop progress={p} />}
    >
      {(p) => (
        <>
          <IntroTitle c={c} progress={p} out={0.16} />
          <SpeedLines progress={p} accent={c.accent} />
          <Telemetry progress={p} accent={c.accent} />
          <RaceSpecs progress={p} accent={c.accent} />
          <ActWipe progress={p} accent={c.accent} />
          <HoodieStage c={c} progress={p} />
        </>
      )}
    </WorldShell>
  )
}

/* Act I backdrop — only the driving segment of the film, then lights out */
function DriveBackdrop({ progress }: { progress: MotionValue<number> }) {
  const videoProgress = useTransform(progress, [0, 0.55], [0, 1], { clamp: true })
  const videoOpacity = useTransform(progress, [0.52, 0.6], [1, 0])

  return (
    <div className="absolute inset-0 bg-black">
      <motion.div style={{ opacity: videoOpacity }} className="absolute inset-0">
        <ScrollVideo
          src="/media/scrub-scroll-f1.mp4"
          progress={videoProgress}
          range={[0, 0.3]}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  )
}

/* red light sweep that carries Act I into Act II */
function ActWipe({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.48, 0.54, 0.6, 0.66], [0, 1, 1, 0])
  const x = useTransform(progress, [0.48, 0.66], ['-110%', '110%'])

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        style={{ x }}
        className="absolute inset-y-[-10%] left-0 w-[140vw] -skew-x-12"
      >
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}22 30%, ${accent}66 48%, #ffffff22 52%, ${accent}22 70%, transparent)`,
            boxShadow: `0 0 140px ${accent}55`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

/* Act II — the drop on a lit stage, hoodie in interactive 3D */
function HoodieStage({ c, progress }: { c: Collection; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.55, 0.68], [0, 1])
  const y = useTransform(progress, [0.55, 0.72], [70, 0])
  const [active, setActive] = useState(false)
  useMotionValueEvent(progress, 'change', (v) => setActive(v > 0.55))

  return (
    <motion.div
      style={{ opacity, y }}
      aria-hidden={!active}
      className={`absolute inset-0 z-10 ${active ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* stage light */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(46% 60% at 62% 52%, ${c.glow}, transparent 70%), radial-gradient(80% 50% at 50% 110%, rgba(255,45,45,0.12), transparent 60%)`,
        }}
      />
      {/* stage floor line */}
      <div
        className="absolute inset-x-[16%] top-[82%] h-px opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-6 sm:flex-row sm:justify-between sm:gap-0 sm:px-16">
        {/* drop info */}
        <div className="order-2 max-w-sm text-center sm:order-1 sm:text-left">
          <span className="text-[11px] uppercase tracking-[0.4em]" style={{ color: c.accent }}>
            The Drop — Act II
          </span>
          <h3 className="display mt-3 text-4xl text-white sm:text-6xl">{c.product.name}</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{c.blurb}</p>
          <div className="mt-5 flex items-center justify-center gap-3 sm:justify-start">
            {c.product.colors.map((col) => (
              <span
                key={col.name}
                title={col.name}
                className="h-5 w-5 rounded-full border border-white/30"
                style={{ background: col.value }}
              />
            ))}
          </div>
          <button
            data-cursor-hover
            className="mt-7 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-[0.25em] text-black transition-transform hover:scale-105"
            style={{ background: c.accent, boxShadow: `0 0 40px ${c.glow}` }}
          >
            Add to Bag — {c.product.price}
          </button>
          <div className="mt-4 text-[10px] uppercase tracking-[0.35em] text-white/40">
            Drag the hoodie to inspect
          </div>
        </div>

        {/* interactive 3D hoodie */}
        <div className="order-1 h-[46vh] w-[min(88vw,520px)] sm:order-2 sm:h-[62vh]">
          {active && (
            <ModelViewer
              url="/media/hoodie-f1.glb"
              width="100%"
              height="100%"
              defaultRotationX={70}
              defaultRotationY={8}
              enableMouseParallax
              enableHoverRotation
              enableManualRotation
              enableManualZoom={false}
              environmentPreset="none"
              ambientIntensity={0.5}
              keyLightIntensity={1.6}
              fillLightIntensity={0.6}
              rimLightIntensity={1.6}
              fadeIn
              autoFrame
              autoRotate
              autoRotateSpeed={0.3}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* live telemetry HUD — Act I only */
function Telemetry({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.12, 0.2, 0.46, 0.54], [0, 1, 1, 0])
  const speed = useTransform(progress, [0.12, 0.5], [0, 347])
  const speedText = useTransform(speed, (v) => `${Math.max(0, Math.round(v))}`)
  const gear = useTransform(speed, (v) => `${Math.min(8, Math.max(1, Math.floor(v / 44) + 1))}`)
  const rpmWidth = useTransform(progress, [0.12, 0.26, 0.38, 0.5], ['8%', '72%', '88%', '96%'])

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-24 left-6 z-10 hidden select-none font-mono sm:left-16 md:block"
      aria-hidden="true"
    >
      <div className="flex items-end gap-5">
        <div>
          <motion.span className="block text-7xl font-bold leading-none text-white tabular-nums">
            {speedText}
          </motion.span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.4em] text-white/60">km/h</span>
        </div>
        <div className="border-l border-white/20 pl-5">
          <motion.span className="block text-5xl font-bold leading-none tabular-nums" style={{ color: accent }}>
            {gear}
          </motion.span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.4em] text-white/60">gear</span>
        </div>
      </div>
      <div className="mt-4 h-1.5 w-72 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: rpmWidth,
            background: `linear-gradient(90deg, ${accent}, #ffd24d)`,
            boxShadow: `0 0 14px ${accent}`,
          }}
        />
      </div>
      <div className="mt-2 flex w-72 justify-between text-[9px] uppercase tracking-[0.3em] text-white/40">
        <span>DRS ENABLED</span>
        <span>SECTOR 1 — PURPLE</span>
      </div>
    </motion.div>
  )
}

/* horizontal red streaks at the screen edges while at speed — Act I */
function SpeedLines({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const opacity = useTransform(progress, [0.14, 0.24, 0.44, 0.54], [0, 0.8, 0.8, 0])
  const x = useTransform(progress, [0.14, 0.54], ['30%', '-60%'])

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {[12, 22, 34, 68, 78, 88].map((top, i) => (
        <motion.span
          key={top}
          style={{
            top: `${top}%`,
            x,
            width: `${28 + (i % 3) * 16}%`,
            background: `linear-gradient(90deg, transparent, ${i % 2 ? accent : '#ffffff'}, transparent)`,
            opacity: 0.5 + (i % 3) * 0.15,
          }}
          className="absolute left-full h-px"
        />
      ))}
    </motion.div>
  )
}

/* pit-wall engineering copy — Act I */
function RaceSpecs({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  const specs = [
    { at: [0.2, 0.27, 0.33, 0.39] as [number, number, number, number], label: 'CARBON WEAVE SHELL', sub: 'Aerodynamic seams, zero drag silhouette' },
    { at: [0.36, 0.42, 0.48, 0.53] as [number, number, number, number], label: 'RACE-RED STITCHING', sub: 'Built in the paddock, worn on the grid' },
  ]

  return (
    <>
      {specs.map((s, i) => (
        <Spec key={s.label} progress={progress} accent={accent} {...s} right={i % 2 === 1} />
      ))}
    </>
  )
}

function Spec({
  progress,
  accent,
  at,
  label,
  sub,
  right,
}: {
  progress: MotionValue<number>
  accent: string
  at: [number, number, number, number]
  label: string
  sub: string
  right?: boolean
}) {
  const opacity = useTransform(progress, at, [0, 1, 1, 0])
  const x = useTransform(progress, [at[0], at[1]], [right ? 60 : -60, 0])

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute top-[32%] z-10 max-w-xs px-6 ${right ? 'right-6 text-right sm:right-16' : 'left-6 sm:left-16'}`}
    >
      <span className="mb-2 block h-px w-14" style={{ background: accent, marginLeft: right ? 'auto' : undefined }} />
      <div className="display text-3xl text-white sm:text-4xl">{label}</div>
      <p className="mt-2 text-sm text-white/60">{sub}</p>
    </motion.div>
  )
}
