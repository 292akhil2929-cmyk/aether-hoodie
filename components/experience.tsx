'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
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
import { F1Section } from './sections/f1-section'
import { AnimeSection } from './sections/anime-section'
import { CarsSection } from './sections/cars-section'
import { EmiratiSection } from './sections/emirati-section'
import { FifaSection } from './sections/fifa-section'
import { WorldBridge } from './sections/world-bridge'
import { CartProvider } from './cart'

const CarTransit = dynamic(() => import('./sections/car-transit').then((module) => module.CarTransit), {
  ssr: false,
  loading: () => <div className="h-[120vh] bg-black" aria-hidden="true" />,
})

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
        <Hero />

        <Marquee
          items={['Cut with intent', 'Numbered editions', 'Made for the after-hours', 'ÆTHER atelier']}
          baseVelocity={2.5}
        />

        <CollectionsGrid onHover={setHoverAccent} />

        {/* five worlds — each a scroll-scrubbed cinematic, stitched with transitions */}
        <F1Section c={collections[0]} onEnter={setAccent} />
        <CarTransit onEnter={setAccent} />
        <AnimeSection c={collections[1]} onEnter={setAccent} />
        <WorldBridge from={collections[1]} to={collections[2]} onEnter={setAccent} />
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
