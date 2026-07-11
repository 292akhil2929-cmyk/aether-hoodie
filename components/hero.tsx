'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'motion/react'
import { ParticleField } from './particle-field'
import { MagneticButton } from './magnetic-button'
import { ChevronDown } from 'lucide-react'

// three.js viewer is client-only
const ModelViewer = dynamic(() => import('./model-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
        Loading the atelier…
      </span>
    </div>
  ),
})

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // mirror to force the JS path — see note in sections/shared.tsx
  const scrollYProgress = useMotionValue(rawProgress.get())
  useMotionValueEvent(rawProgress, 'change', (v) => scrollYProgress.set(v))

  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const stageOpacity = useTransform(scrollYProgress, [0, 0.7, 0.85, 1], [1, 1, 0.5, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[150vh] flex-col items-center justify-start overflow-hidden"
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(200,60,60,0.28), transparent 70%)' }}
        />
        <div className="absolute inset-0 opacity-70">
          <ParticleField color="rgba(200,210,230," count={110} />
        </div>
        {/* floor grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-[45vh] opacity-30"
          style={{
            background:
              'linear-gradient(transparent, rgba(255,255,255,0.05)), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 80px)',
            transform: 'perspective(500px) rotateX(65deg)',
            transformOrigin: 'bottom',
          }}
        />
      </div>

      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center">
        {/* headline */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="pointer-events-none absolute top-[12%] z-20 px-4 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-[11px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            Aether Atelier — Est. 2026
          </motion.p>
          <h1 className="display text-balance text-5xl leading-[0.85] sm:text-7xl md:text-8xl lg:text-[7rem]">
            <span className="block text-chrome">WE DON&apos;T SELL HOODIES.</span>
            <span className="block text-chrome">WE SELL IDENTITIES.</span>
          </h1>
        </motion.div>

        {/* interactive 3D hoodie — drag to spin, mouse parallax, slow auto-rotate */}
        <motion.div
          style={{ scale: stageScale, y: stageY, opacity: stageOpacity }}
          className="relative z-10 mt-10 flex w-full items-center justify-center"
        >
          <div
            className="absolute h-[52vh] w-[52vh] max-w-[90vw] rounded-full opacity-70 blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(255,45,45,0.30), rgba(120,20,20,0.12) 55%, transparent 75%)' }}
          />
          <div className="relative z-10 h-[58vh] w-[min(92vw,640px)]">
            <ModelViewer
              url="/media/hoodie-f1.glb"
              width="100%"
              height="100%"
              modelXOffset={0}
              modelYOffset={-0.04}
              defaultRotationX={70}
              defaultRotationY={8}
              enableMouseParallax
              enableHoverRotation
              enableManualRotation
              enableManualZoom={false}
              environmentPreset="none"
              ambientIntensity={0.5}
              keyLightIntensity={1.5}
              fillLightIntensity={0.7}
              rimLightIntensity={1.4}
              fadeIn
              autoFrame
              autoRotate
              autoRotateSpeed={0.35}
            />
          </div>
        </motion.div>

        {/* drag hint */}
        <motion.span
          style={{ opacity: titleOpacity }}
          className="pointer-events-none absolute bottom-[26%] z-20 flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/40"
        >
          <span className="inline-block h-px w-6 bg-white/30" />
          Drag to rotate
          <span className="inline-block h-px w-6 bg-white/30" />
        </motion.span>

        {/* buttons */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute bottom-[8%] z-20 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton accent="#e8eaee" variant="solid" onClick={() => scrollTo('f1')}>
              Explore Collection
            </MagneticButton>
            <MagneticButton accent="#e8eaee" variant="ghost" onClick={() => scrollTo('fifa')}>
              Limited Drop
            </MagneticButton>
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
