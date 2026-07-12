'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react'

type Design = { id: number; category: string; src: string }

const PAGE_SIZE = 48

export function DesignCatalog() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch('/designs/manifest.json')
      .then((response) => response.json())
      .then((data: Design[]) => setDesigns(data.filter((design) => !design.category.toLowerCase().includes('anime'))))
      .catch(() => setDesigns([]))
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(designs.map((design) => design.category)))], [designs])
  const filtered = useMemo(() => designs.filter((design) => {
    const matchesCategory = category === 'All' || design.category === category
    const matchesQuery = !query || `${design.id} ${design.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  }), [category, designs, query])

  return (
    <section id="designs" className="relative mx-auto max-w-7xl px-4 py-28 sm:py-36">
      <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">The design archive</span>
          <h2 className="display mt-3 text-6xl text-chrome sm:text-8xl">FIND YOUR CUT</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Hundreds of studies in colour, craft and attitude. Save the one that feels like yours.</p>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          <span className="h-2 w-2 rounded-full bg-[#ff2d2d] shadow-[0_0_12px_#ff2d2d]" />
          {designs.length || '—'} designs
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button key={item} onClick={() => { setCategory(item); setVisible(PAGE_SIZE) }} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors ${category === item ? 'border-white bg-white text-black' : 'border-white/15 text-white/55 hover:border-white/50 hover:text-white'}`}>
              {item}
            </button>
          ))}
        </div>
        <label className="glass flex items-center gap-3 rounded-full px-4 py-2.5 text-white/50">
          <Search className="h-4 w-4" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE) }} placeholder="Search the archive" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/35 lg:w-48" />
          <SlidersHorizontal className="h-4 w-4" />
        </label>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.slice(0, visible).map((design) => (
          <article key={design.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
            <img src={design.src} alt={`ÆTHER design ${String(design.id).padStart(3, '0')}`} loading="lazy" className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/25 to-transparent p-3 pt-12">
              <div>
                <span className="text-[9px] uppercase tracking-[0.24em] text-white/45">{String(design.id).padStart(3, '0')}</span>
                <p className="mt-1 line-clamp-1 text-[10px] uppercase tracking-[0.14em] text-white/80">{design.category}</p>
              </div>
              <a href={design.src} target="_blank" rel="noreferrer" aria-label={`Open design ${design.id}`} className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white transition group-hover:border-white group-hover:bg-white group-hover:text-black">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {visible < filtered.length && <button onClick={() => setVisible((count) => count + PAGE_SIZE)} className="mx-auto mt-12 flex rounded-full border border-white/20 px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-white/70 transition hover:border-white hover:text-white">Load more designs · {filtered.length - visible} left</button>}
      {!designs.length && <p className="mt-12 text-center text-sm text-white/45">Loading the archive…</p>}
      {designs.length > 0 && !filtered.length && <p className="mt-12 text-center text-sm text-white/45">No designs match that search.</p>}
    </section>
  )
}
