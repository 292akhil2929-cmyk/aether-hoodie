export type TerrainProduct = {
  id: string
  name: string
  world: string
  price: string
  image: string
  tone: string
  note: string
}

const selectedIds = [107, 106, 103, 102, 101, 99, 96, 86, 73, 72, 69, 61, 56, 51, 45, 39, 35, 34, 28, 25, 26, 17, 14, 15, 13, 1]

const special: TerrainProduct[] = [
  { id: 'orbit', name: 'ORBIT / 01', world: 'Space capsule', price: 'AED 780', image: '/media/terrain-orbit-01.png', tone: '#90a5ff', note: 'Reflective contour ink, orbital foil ribbon, 480gsm brushed cotton.' },
  { id: 'eclipse', name: 'UMBRA / 02', world: 'Space capsule', price: 'AED 760', image: '/media/terrain-eclipse-02.png', tone: '#e59a56', note: 'Sun-faded rust wash, eclipse dye placement, tonal topographic embroidery.' },
  { id: 'trails', name: 'LIGHT TRAILS', world: 'Selected concept', price: 'AED 720', image: '/catalog/terrain-approved-trails.png', tone: '#d7a66d', note: 'Long-exposure road lines rendered as a quiet, continuous chest graphic.' },
  { id: 'aurora', name: 'AURORA FLOW', world: 'Selected concept', price: 'AED 740', image: '/catalog/terrain-approved-aurora.png', tone: '#74e8d0', note: 'A fluid aurora ribbon moves across a deep black heavyweight fleece.' },
  { id: 'violet', name: 'VIOLET SYSTEM', world: 'Selected concept', price: 'AED 740', image: '/catalog/terrain-approved-violet.png', tone: '#e897f4', note: 'A violet colour story with a concentrated cosmic core.' },
  { id: 'spectrum', name: 'SPECTRUM BREAK', world: 'Selected concept', price: 'AED 760', image: '/catalog/terrain-approved-spectrum.png', tone: '#ffcc51', note: 'Prismatic shards and a disciplined burst of spectrum colour.' },
  { id: 'weather-mark', name: 'WEATHER MARK', world: 'Selected concept', price: 'AED 690', image: '/catalog/terrain-approved-weather.png', tone: '#d2d6dc', note: 'A nearly blank weather-grey hoodie with a small, considered embroidered signal.' },
  { id: 'frame', name: 'UNTITLED HUMAN', world: 'Selected concept', price: 'AED 700', image: '/catalog/terrain-approved-frame.png', tone: '#d9bc7d', note: 'Front and back concept: a quiet label and an empty gilded frame.' },
  { id: 'still-loading', name: 'STILL LOADING', world: 'Four-piece concept', price: 'AED 720', image: '/catalog/terrain-approved-still-loading.png', tone: '#c6a26b', note: 'A split garment study balancing a detailed dragon with a restrained loading cue.' },
  { id: 'spotlight', name: 'SPOTLIGHT', world: 'Four-piece concept', price: 'AED 700', image: '/catalog/terrain-approved-spotlight.png', tone: '#d7e8ff', note: 'A single overhead beam turns the chest into a tiny stage.' },
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
