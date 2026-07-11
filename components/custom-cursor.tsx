'use client'

import { useEffect, useRef, useState } from 'react'

type Trail = { x: number; y: number; id: number }

export function CustomCursor({ accent }: { accent: string }) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [trails, setTrails] = useState<Trail[]>([])
  const trailId = useRef(0)

  useEffect(() => {
    // only on fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.classList.add('custom-cursor-active')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf = 0
    let lastTrail = 0

    const move = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`
      }
      const now = performance.now()
      if (now - lastTrail > 40) {
        lastTrail = now
        const id = trailId.current++
        setTrails((t) => [...t.slice(-10), { x: pos.x, y: pos.y, id }])
        setTimeout(() => setTrails((t) => t.filter((tr) => tr.id !== id)), 550)
      }

      const target = e.target as HTMLElement
      setHovering(!!target.closest('a, button, [data-cursor-hover]'))
    }

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.18
      ring.y += (pos.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 20}px, ${ring.y - 20}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', move)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <>
      {trails.map((t) => (
        <div
          key={t.id}
          className="pointer-events-none fixed z-[9998] hidden h-2 w-2 rounded-full md:block"
          style={{
            left: t.x - 4,
            top: t.y - 4,
            background: accent,
            opacity: 0.4,
            filter: 'blur(2px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        />
      ))}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full md:block"
        style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-10 w-10 rounded-full border md:block"
        style={{
          borderColor: accent,
          transition: 'width 0.25s, height 0.25s, opacity 0.25s',
          opacity: hovering ? 0.9 : 0.5,
          transform: hovering ? 'scale(1.6)' : 'scale(1)',
        }}
      />
    </>
  )
}
