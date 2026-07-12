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

const stories: Record<number, string> = {
  107: 'A midnight relay between restraint and speed. The silver route cuts across the body like a signal finding its way home.',
  106: 'Built from a quiet visual frequency. Soft structure and a single controlled gesture give this study its pull.',
  103: 'A preserved fragment from the first image studies. It holds the kind of colour that feels discovered, not applied.',
  99: 'A landscape reduced to its most essential movement. The linework asks you to look twice, then stays with you.',
  73: 'A small world in motion, held inside heavyweight cloth. Designed for the moment a familiar route becomes unfamiliar.',
  69: 'A study in contrast: weight against light, silence against a single visible pulse. Nothing here is accidental.',
  56: 'Built from the after-image of a night drive. The composition keeps moving long after the road disappears.',
  45: 'A saturated field cut back to its strongest shapes. It is graphic, but never loud.',
  26: 'This one treats the garment as terrain rather than a canvas. The art follows the construction, not the other way around.',
  15: 'A calm surface with an unsettled undercurrent. The closer you get, the more the detail reveals itself.',
  13: 'A final first-edition study: elemental, direct, and deliberately hard to place.',
}

const special: TerrainProduct[] = [
  { id: 'orbit', name: 'ORBIT / 01', world: 'Space capsule', price: 'AED 780', image: '/media/terrain-orbit-01.png', tone: '#90a5ff', note: 'Reflective contour ink, orbital foil ribbon, 480gsm brushed cotton.' },
  { id: 'breach', name: 'BREACH / 01', world: 'Colour study', price: 'AED 790', image: '/media/terrain-breach-01.png', tone: '#6dcdf1', note: 'The moment colour breaks through a controlled black surface. A single fracture becomes a route into cobalt, magenta and amber.' },
  { id: 'trails', name: 'LIGHT TRAILS', world: 'Selected concept', price: 'AED 720', image: '/catalog/terrain-approved-trails.png', tone: '#d7a66d', note: 'Long-exposure road lines rendered as a quiet, continuous chest graphic.' },
  { id: 'aurora', name: 'AURORA FLOW', world: 'Selected concept', price: 'AED 740', image: '/catalog/terrain-approved-aurora.png', tone: '#74e8d0', note: 'A fluid aurora ribbon moves across a deep black heavyweight fleece.' },
]

export const terrainProducts: TerrainProduct[] = [
  ...special,
  ...selectedIds.map((id, index) => ({
    id: `selection-${id}`,
    name: `SELECTION / ${String(id).padStart(3, '0')}`,
    world: id === 107 ? 'Cobalt relay' : 'Approved archive',
    price: `AED ${680 + (index % 5) * 20}`,
    image: id === 107 ? '/media/terrain-cobalt-relay-107.png' : `/catalog/terrain-${String(id).padStart(3, '0')}.png`,
    tone: ['#e8e8e8', '#d6c1a3', '#a8c9df', '#c8b1e3', '#d9a38e'][index % 5],
    note: stories[id],
  })),
]
