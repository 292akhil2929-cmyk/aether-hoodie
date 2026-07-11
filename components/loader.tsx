'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let alive = true
    const started = performance.now()
    const videoReady = new Promise<void>((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.src = '/media/scrub-scroll-f1.mp4'
      video.onloadedmetadata = () => resolve()
      video.onerror = () => resolve()
    })
    const assets = [
      document.fonts?.ready ?? Promise.resolve(),
      fetch('/media/hoodie-f1.glb', { method: 'HEAD' }).catch(() => undefined),
      videoReady,
    ]

    const ready = async () => {
      setProgress(12)
      let complete = 0
      await Promise.all(assets.map(async (asset) => {
        await asset
        complete += 1
        if (alive) setProgress(12 + complete * 26)
      }))
      const remaining = Math.max(0, 850 - (performance.now() - started))
      window.setTimeout(() => {
        if (!alive) return
        setProgress(100)
        window.setTimeout(() => {
          if (!alive) return
          setGone(true)
          window.setTimeout(onDone, 700)
        }, 220)
      }, remaining)
    }
    void ready()
    return () => { alive = false }
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-10 flex items-center justify-center"
          >
            <span
              className="absolute h-24 w-24 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse-ring 2s ease-out infinite' }}
            />
            <span className="display text-5xl text-chrome">Æ</span>
          </motion.div>

          <div className="h-px w-56 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex w-56 justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>Entering the showroom</span>
            <span>{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
