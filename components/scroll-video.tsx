'use client'

import { useEffect, useRef, useState } from 'react'
import { type MotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'

type Props = {
  src: string
  /** scroll progress (0 → 1) that scrubs the video timeline */
  progress: MotionValue<number>
  className?: string
  poster?: string
  /** map progress onto a sub-range of the video, e.g. [0, 0.3] scrubs only the first 30% */
  range?: [number, number]
}

/**
 * A sticky, full-viewport video whose playback position is driven by scroll.
 * Instead of auto-playing, each frame is tied to how far you've scrolled,
 * producing the cinematic "scrub" effect (Apple-style).
 *
 * The source videos are encoded with every frame as a keyframe (-g 1),
 * so currentTime seeks resolve instantly and the scrub is frame-perfect.
 * Loading is deferred until the section approaches the viewport.
 */
export function ScrollVideo({ src, progress, className, poster, range }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const target = useRef(0)
  const current = useRef(0)
  const raf = useRef<number>(0)
  const duration = useRef(0)
  const [near, setNear] = useState(false)
  const reduceMotion = useReducedMotion()

  // only pull the (heavy, all-intra) video once the section is near the viewport
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduceMotion) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !near || reduceMotion) return
    const onMeta = () => {
      duration.current = v.duration || 0
    }
    v.addEventListener('loadedmetadata', onMeta)
    v.load()
    return () => v.removeEventListener('loadedmetadata', onMeta)
  }, [src, near, reduceMotion])

  useMotionValueEvent(progress, 'change', (p) => {
    target.current = Math.min(Math.max(p, 0), 1)
  })

  useEffect(() => {
    const loop = () => {
      const v = videoRef.current
      if (!reduceMotion && v && duration.current) {
        current.current += (target.current - current.current) * 0.14
        const [r0, r1] = range ?? [0, 1]
        const frac = r0 + current.current * (r1 - r0)
        const t = frac * (duration.current - 0.05)
        // never queue a seek behind an unfinished one, and skip
        // sub-frame deltas — keeps decode pressure off the main thread
        if (!v.seeking && Math.abs(v.currentTime - t) > 1 / 30) {
          try {
            v.currentTime = t
          } catch {
            /* seeking may briefly throw while buffering */
          }
        }
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, range])

  return (
    <video
      ref={videoRef}
      className={className}
      src={near && !reduceMotion ? src : undefined}
      poster={poster}
      muted
      playsInline
      preload={near && !reduceMotion ? 'auto' : 'none'}
      webkit-playsinline="true"
    />
  )
}
