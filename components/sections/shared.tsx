'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react'
import type { Collection } from '@/lib/collections'
import { ScrollVideo } from '../scroll-video'
import { useCart } from '../cart'

/* ------------------------------------------------------------------ */
/* WorldShell — tall scroll runway with a sticky cinematic viewport.   */
/* Provides the scrubbed video backdrop, vignette, accent wash, ghost  */
/* numeral and section label. Each world layers its own overlays on    */
/* top via the render-prop children(progress).                         */
/* ------------------------------------------------------------------ */

export function WorldShell({
  c,
  heightVh = 380,
  videoSrc,
  onEnter,
  children,
  background,
}: {
  c: Collection
  heightVh?: number
  videoSrc?: string
  onEnter?: (accent: string) => void
  /** custom background layers (used instead of the single scrub video) */
  background?: (progress: MotionValue<number>) => ReactNode
  children: (progress: MotionValue<number>) => ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Mirror through a plain MotionValue. motion v12 otherwise promotes
  // scroll-linked styles to native WAAPI ViewTimeline animations, and its
  // generated keyframes don't pad partial input ranges to [0,1] — WAAPI then
  // interpolates back to the underlying style, corrupting every overlay
  // window. The mirror forces the (correct) JS path.
  const scrollYProgress = useMotionValue(rawProgress.get())

  useMotionValueEvent(rawProgress, 'change', (v) => {
    scrollYProgress.set(v)
    if (ref.current) ref.current.dataset.p = v.toFixed(3)
    if (v > 0.02 && v < 0.98) onEnter?.(c.accent)
  })

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1])
  const numY = useTransform(scrollYProgress, [0, 1], [120, -120])
  const numOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0.07, 0.07, 0])
  const vignette = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], [0.35, 0.48, 0.6, 0.75])
  const vignetteBg = useTransform(
    vignette,
    (v) =>
      `radial-gradient(120% 100% at 50% 40%, transparent 0%, rgba(0,0,0,${v}) 100%), linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.85) 100%)`,
  )

  return (
    <section
      ref={ref}
      id={c.id}
      className="relative"
      style={{ height: `${heightVh}vh` }}
      aria-label={`${c.name} collection`}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        {/* scroll-scrubbed cinematic backdrop */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0">
          {background ? (
            background(scrollYProgress)
          ) : videoSrc ? (
          <ScrollVideo
            src={videoSrc}
            progress={scrollYProgress}
            poster={c.media}
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={c.media || '/placeholder.svg'} alt="" className="h-full w-full object-cover" />
          )}
        </motion.div>

        {/* darkening vignette + accent wash */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: vignetteBg }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: `radial-gradient(60% 60% at 50% 50%, ${c.accent}, transparent 70%)` }}
        />

        {/* giant ghost numeral */}
        <motion.span
          style={{ y: numY, opacity: numOpacity }}
          className="display pointer-events-none absolute select-none text-[40vw] leading-none text-white"
        >
          {c.index}
        </motion.span>

        {/* fixed section label */}
        <div className="absolute left-6 top-24 z-20 flex items-center gap-3 sm:left-10">
          <span className="h-2 w-2 rounded-full" style={{ background: c.accent, boxShadow: `0 0 12px ${c.accent}` }} />
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/70">
            {c.index} — {c.name}
          </span>
        </div>

        {children(scrollYProgress)}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* IntroTitle — the opening statement of a world, fades on scroll.     */
/* ------------------------------------------------------------------ */

export function IntroTitle({
  c,
  progress,
  out = 0.2,
}: {
  c: Collection
  progress: MotionValue<number>
  out?: number
}) {
  const opacity = useTransform(progress, [0, out * 0.55, out * 0.8, out], [1, 1, 0.45, 0])
  const y = useTransform(progress, [0, out], [0, -120])
  const scale = useTransform(progress, [0, out], [1, 1.12])

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center"
    >
      <span className="mb-4 text-xs uppercase tracking-[0.5em]" style={{ color: c.accent }}>
        {c.tag}
      </span>
      <h2 className="display text-balance text-5xl leading-[0.92] text-white sm:text-7xl md:text-8xl">
        {c.headline}
      </h2>
      {c.intro && (
        <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
          {c.intro}
        </p>
      )}
      <span className="mt-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/50">
        Scroll
        <span className="inline-block h-8 w-px animate-pulse" style={{ background: c.accent }} />
      </span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* SpecStrip — mid-scroll price + copy strip.                          */
/* ------------------------------------------------------------------ */

export function SpecStrip({
  c,
  progress,
  align = 'left',
  window: w = [0.3, 0.42, 0.55, 0.62],
}: {
  c: Collection
  progress: MotionValue<number>
  align?: 'left' | 'right'
  window?: [number, number, number, number]
}) {
  const opacity = useTransform(progress, w, [0, 1, 1, 0])
  const x = useTransform(progress, [w[0], w[1]], [align === 'left' ? -80 : 80, 0])
  const isRight = align === 'right'

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute top-1/2 z-10 max-w-xs -translate-y-1/2 px-6 ${
        isRight ? 'right-6 text-right sm:right-16' : 'left-6 text-left sm:left-16'
      }`}
    >
      <div className="text-6xl font-light text-white sm:text-7xl">{c.product.price}</div>
      <div className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">{c.product.name}</div>
      <p className="mt-4 text-sm leading-relaxed text-white/60">{c.blurb}</p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* ProductReveal — end-of-world drop panel.                            */
/* ------------------------------------------------------------------ */

export function ProductReveal({
  c,
  progress,
  align = 'left',
  from = 0.66,
}: {
  c: Collection
  progress: MotionValue<number>
  align?: 'left' | 'right'
  from?: number
}) {
  const { addItem } = useCart()
  const opacity = useTransform(progress, [from, from + 0.14], [0, 1])
  const y = useTransform(progress, [from, from + 0.18], [90, 0])
  const scale = useTransform(progress, [from, from + 0.18], [0.92, 1])
  const isRight = align === 'right'

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`absolute bottom-0 z-10 flex w-full flex-col items-center gap-8 px-6 pb-16 sm:flex-row sm:items-end sm:justify-between sm:px-16 ${
        isRight ? 'sm:flex-row-reverse' : ''
      }`}
    >
      <div className={`max-w-sm ${isRight ? 'sm:text-right' : ''}`}>
        <span className="text-[11px] uppercase tracking-[0.4em]" style={{ color: c.accent }}>
          The Drop
        </span>
        <h3 className="display mt-3 text-4xl text-white sm:text-5xl">{c.product.name}</h3>
        <div className={`mt-4 flex items-center gap-3 ${isRight ? 'sm:justify-end' : ''}`}>
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
          onClick={() => addItem({ name: c.product.name, price: c.product.price, image: c.product.image, accent: c.accent })}
          className="mt-6 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-[0.25em] text-black transition-transform hover:scale-105"
          style={{ background: c.accent, boxShadow: `0 0 40px ${c.glow}` }}
        >
          Add to selection — {c.product.price}
        </button>
      </div>

      <div className="relative w-52 sm:w-72 md:w-80">
        <div
          className="absolute inset-0 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c.glow}, transparent 70%)` }}
        />
        <img
          src={c.product.image || '/placeholder.svg'}
          alt={c.product.name}
          className="relative w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
        />
      </div>
    </motion.div>
  )
}
