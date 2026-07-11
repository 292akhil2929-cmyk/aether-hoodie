'use client'

import { useState } from 'react'
import { collections } from '@/lib/collections'
import { SmoothScroll } from './smooth-scroll'
import { CustomCursor } from './custom-cursor'
import { Navbar } from './navbar'
import { Loader } from './loader'
import { Hero } from './hero'
import { CollectionsGrid } from './collections-grid'
import { Footer } from './footer'
import { ScrollProgress } from './scroll-progress'
import { Marquee } from './marquee'
import { CarsSection } from './sections/cars-section'
import { EmiratiSection } from './sections/emirati-section'
import { FifaSection } from './sections/fifa-section'
import { WorldBridge } from './sections/world-bridge'
import { CartProvider } from './cart'
import { DesignCatalog } from './design-catalog'

const DEFAULT_ACCENT = '#e8eaee'

export function Experience() {
  const [, setLoaded] = useState(false)
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [hoverAccent, setHoverAccent] = useState<string | null>(null)

  const activeAccent = hoverAccent ?? accent

  return (
    <CartProvider>
      <Loader onDone={() => setLoaded(true)} />
      <SmoothScroll />
      <CustomCursor accent={activeAccent} />
      <ScrollProgress accent={activeAccent} />

      {/* global accent ambient wash that transitions with the section */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${activeAccent}12, transparent 55%)`,
        }}
      />

      <Navbar accent={activeAccent} />

      <main className="relative z-10">
        <DesignCatalog />
        <Hero />

        <Marquee
          items={['Cut with intent', 'Numbered editions', 'Made for the after-hours', 'ÆTHER atelier']}
          baseVelocity={2.5}
        />

        <CollectionsGrid onHover={setHoverAccent} />

        {/* the remaining worlds — each a scroll-scrubbed cinematic, stitched with transitions */}
        <CarsSection c={collections[2]} onEnter={setAccent} />
        <WorldBridge from={collections[2]} to={collections[3]} onEnter={setAccent} />
        <EmiratiSection c={collections[3]} onEnter={setAccent} />
        <WorldBridge from={collections[3]} to={collections[4]} onEnter={setAccent} />
        <FifaSection c={collections[4]} onEnter={setAccent} />

        <Marquee
          items={['Limited quantities', 'Numbered pieces', 'Considered details', 'No reruns']}
          baseVelocity={3.5}
        />

        <Footer />
      </main>
    </CartProvider>
  )
}
