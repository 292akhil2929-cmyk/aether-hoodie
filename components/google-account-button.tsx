'use client'

import { useEffect, useState } from 'react'
import { LogIn } from 'lucide-react'

export function GoogleAccountButton() {
  const [enabled, setEnabled] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch('/api/auth/providers').then((response) => response.json()).then((providers) => setEnabled(Boolean(providers?.google))).catch(() => setEnabled(false)).finally(() => setChecked(true))
  }, [])

  if (!checked) return <span className="hidden h-9 w-24 animate-pulse rounded-full bg-white/5 sm:block" aria-hidden="true" />
  if (!enabled) return <span title="Google sign-in will be enabled once OAuth credentials are connected." className="hidden rounded-full border border-white/10 px-3 py-2 text-[9px] uppercase tracking-[.16em] text-white/35 sm:block">Member access</span>
  return <button onClick={() => { window.location.assign('/api/auth/signin/google') }} className="hidden items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.16em] text-white/70 transition hover:border-white hover:bg-white hover:text-black sm:flex"><LogIn className="h-3.5 w-3.5" />Sign in</button>
}
