'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'

export function ScrollProgress({ accent }: { accent: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const pct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}`)

  return (
    <>
      {/* top progress line */}
      <motion.div
        style={{ scaleX, background: accent, boxShadow: `0 0 16px ${accent}` }}
        className="fixed inset-x-0 top-0 z-[150] h-[3px] origin-left transition-[background] duration-1000"
      />

      {/* side percentage dial */}
      <div className="fixed bottom-6 right-6 z-[150] hidden select-none items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full transition-[background] duration-1000"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
        <motion.span style={{ color: accent }}>{pct}</motion.span>
        <span>/ 100</span>
      </div>
    </>
  )
}
