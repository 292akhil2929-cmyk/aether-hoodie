'use client'

import { motion } from 'motion/react'
import { AtSign, Globe, Share2 } from 'lucide-react'
import { ParticleField } from './particle-field'
import { MagneticButton } from './magnetic-button'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 py-24">
      <div className="absolute inset-0 -z-10 opacity-60">
        <ParticleField color="rgba(200,210,230," count={120} />
      </div>
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full opacity-20"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(200,210,230,0.4), transparent)',
        }}
      />

      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
          Join the Atelier
        </span>
        <h2 className="display mt-4 text-5xl text-chrome sm:text-7xl">NEVER MISS A DROP</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          Limited editions sell out in minutes. Get early access to every world before the world does.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="glass mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full p-2"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <MagneticButton accent="#e8eaee" variant="solid">
            Subscribe
          </MagneticButton>
        </form>

        <div className="mt-14 flex items-center justify-center gap-4">
          {[AtSign, Globe, Share2].map((Icon, i) => (
            <motion.a
              key={i}
              href="#"
              data-cursor-hover
              whileHover={{ y: -4 }}
              aria-label="social link"
              className="glass flex h-12 w-12 items-center justify-center rounded-full text-foreground"
            >
              <Icon className="h-5 w-5" />
            </motion.a>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-2">
          <span className="display text-4xl text-chrome">ÆTHER</span>
          <p className="text-xs text-muted-foreground">
            © 2026 Aether Atelier. Worn by identities, not customers.
          </p>
        </div>
      </div>
    </footer>
  )
}
