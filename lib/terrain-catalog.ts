export type TerrainProduct = {
  id: string
  name: string
  world: string
  price: string
  image: string
  tone: string
  note: string
}

const selectedIds = [107, 106, 103, 99, 73, 69, 56, 45, 26, 15, 13]

const special: TerrainProduct[] = [
  { id: 'orbit', name: 'ORBIT / 01', world: 'Space capsule', price: 'AED 780', image: '/media/terrain-orbit-01.png', tone: '#90a5ff', note: 'Reflective contour ink, orbital foil ribbon, 480gsm brushed cotton.' },
  { id: 'trails', name: 'LIGHT TRAILS', world: 'Selected concept', price: 'AED 720', image: '/catalog/terrain-approved-trails.png', tone: '#d7a66d', note: 'Long-exposure road lines rendered as a quiet, continuous chest graphic.' },
  { id: 'aurora', name: 'AURORA FLOW', world: 'Selected concept', price: 'AED 740', image: '/catalog/terrain-approved-aurora.png', tone: '#74e8d0', note: 'A fluid aurora ribbon moves across a deep black heavyweight fleece.' },
  { id: 'spectrum', name: 'SPECTRUM BREAK', world: 'Selected concept', price: 'AED 760', image: '/catalog/terrain-approved-spectrum.png', tone: '#ffcc51', note: 'Prismatic shards and a disciplined burst of spectrum colour.' },
]

export const terrainProducts: TerrainProduct[] = [
  ...special,
  ...selectedIds.map((id, index) => ({
    id: `selection-${id}`,
    name: `SELECTION / ${String(id).padStart(3, '0')}`,
    world: id === 107 ? 'Cobalt relay' : 'Approved archive',
    price: `AED ${680 + (index % 5) * 20}`,
    image: `/catalog/terrain-${String(id).padStart(3, '0')}.png`,
    tone: ['#e8e8e8', '#d6c1a3', '#a8c9df', '#c8b1e3', '#d9a38e'][index % 5],
    note: 'Hand-selected from the first TERRAIN image study. Full sizing and construction details available in the product view.',
  })),
]
