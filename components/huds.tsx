'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export function F1Hud({ accent }: { accent: string }) {
  const [mounted, setMounted] = useState(false)
  const [rpm, setRpm] = useState(0)
  const [lap, setLap] = useState(0)
  const [ms, setMs] = useState(0)

  useEffect(() => {
    setMounted(true)
    let raf = 0
    let dir = 1
    let v = 0
    const loop = () => {
      v += dir * (Math.random() * 400 + 100)
      if (v > 14500) dir = -1
      if (v < 4000) dir = 1
      setRpm(Math.round(v))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const t = setInterval(() => {
      setLap((l) => l + 1)
      setMs(Math.floor(Math.random() * 99))
    }, 1000)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(t)
    }
  }, [])

  const pct = Math.min(100, (rpm / 15000) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 flex flex-wrap items-center gap-4 font-mono text-xs"
    >
      <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
        <span className="text-muted-foreground">RPM</span>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
        </div>
        <span style={{ color: accent }}>{rpm.toLocaleString()}</span>
      </div>
      <div className="glass rounded-full px-4 py-2">
        <span className="text-muted-foreground">LAP</span>{' '}
        <span style={{ color: accent }}>
          {Math.floor(lap / 60)}:{String(lap % 60).padStart(2, '0')}.
          {mounted ? String(ms).padStart(2, '0') : '00'}
        </span>
      </div>
      <div className="glass rounded-full px-4 py-2 text-muted-foreground">
        DRS <span style={{ color: accent }}>ENABLED</span>
      </div>
    </motion.div>
  )
}

export function FifaHud({ accent }: { accent: string }) {
  const [beat, setBeat] = useState(72)
  useEffect(() => {
    const t = setInterval(() => setBeat(68 + Math.floor(Math.random() * 14)), 700)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 flex flex-wrap items-center gap-4 font-mono text-xs"
    >
      <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 0.7 }}
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: accent }}
        />
        <span className="text-muted-foreground">CROWD BPM</span>
        <span style={{ color: accent }}>{beat}</span>
      </div>
      <div className="glass rounded-full px-4 py-2 text-muted-foreground">
        90:00 <span style={{ color: accent }}>+ET</span>
      </div>
      <div className="glass flex items-center gap-1 rounded-full px-4 py-2">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            animate={{ height: [4, Math.random() * 16 + 4, 4] }}
            transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.5 }}
            className="w-0.5 rounded-full"
            style={{ background: accent }}
          />
        ))}
      </div>
    </motion.div>
  )
}
