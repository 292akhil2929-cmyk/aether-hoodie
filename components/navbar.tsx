'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ShoppingBag, Volume2, VolumeX } from 'lucide-react'

const links = [
  { label: 'Formula 1', href: '#f1' },
  { label: 'Anime', href: '#anime' },
  { label: 'Exotic Cars', href: '#cars' },
  { label: 'Emirati', href: '#emirati' },
  { label: 'World Cup', href: '#fifa' },
]

export function Navbar({ accent }: { accent: string }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sound, setSound] = useState(false)
  const [cart] = useState(3)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(latest > prev && latest > 300)
    setScrolled(latest > 40)
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
          scrolled ? 'glass' : 'bg-transparent'
        }`}
      >
        <a href="#top" className="group flex items-center gap-2" data-cursor-hover>
          <span
            className="display text-2xl leading-none transition-colors"
            style={{ color: 'var(--color-foreground)' }}
          >
            ÆTHER
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full transition-colors"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor-hover
              className="group relative px-4 py-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span
                className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: accent }}
              />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSound((s) => !s)}
            data-cursor-hover
            aria-label={sound ? 'Mute ambient sound' : 'Enable ambient sound'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            data-cursor-hover
            aria-label="Open cart"
            className="relative flex h-9 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium uppercase tracking-widest text-foreground transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              <motion.span
                key={cart}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-background"
                style={{ background: accent }}
              >
                {cart}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
