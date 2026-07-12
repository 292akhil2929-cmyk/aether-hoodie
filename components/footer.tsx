'use client'

import { useState } from 'react'
import { ParticleField } from './particle-field'
import { MagneticButton } from './magnetic-button'

export function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.location.href = `mailto:studio@aetheratelier.com?subject=${encodeURIComponent('ÆTHER early access')}&body=${encodeURIComponent(`Please add ${email} to the ÆTHER early-access list.`)}`
    setSent(true)
  }

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
          Private access
        </span>
        <h2 className="display mt-4 text-5xl text-chrome sm:text-7xl">STAY CLOSE</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          New pieces arrive quietly. Leave a note and we&apos;ll send early access when the next edition is ready.
        </p>

        <form
          onSubmit={submit}
          className="glass mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full p-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <MagneticButton accent="#e8eaee" variant="solid">
            Request access
          </MagneticButton>
        </form>
        {sent && <p className="mt-4 text-xs text-white/60">Your email app has been opened with the request ready to send.</p>}

        <div className="mt-16 flex flex-col items-center gap-2">
          <span className="display text-4xl text-chrome">ÆTHER</span>
          <p className="text-xs text-muted-foreground">
            © 2026 ÆTHER atelier. Designed in Dubai, released worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
