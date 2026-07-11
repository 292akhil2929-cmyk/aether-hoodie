'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
} from 'motion/react'

function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export function Marquee({
  items,
  baseVelocity = 3,
}: {
  items: string[]
  baseVelocity?: number
}) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const directionFactor = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -1
    else if (velocityFactor.get() > 0) directionFactor.current = 1
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  const row = [...items, ...items, ...items, ...items]

  return (
    <section className="relative overflow-hidden border-y border-white/10 py-8">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="display mx-8 flex items-center gap-8 text-4xl uppercase text-chrome sm:text-6xl md:text-7xl"
          >
            {item}
            <span className="text-2xl text-muted-foreground sm:text-4xl">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}
