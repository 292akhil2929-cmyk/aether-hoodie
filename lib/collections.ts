export type Collection = {
  id: string
  index: string
  name: string
  tag: string
  accent: string
  glow: string
  headline: string
  blurb: string
  media: string
  mediaType: 'video' | 'image'
  scrollVideo?: string
  intro?: string
  poster?: string
  product: {
    name: string
    price: string
    image: string
    colors: { name: string; value: string }[]
  }
}

export const collections: Collection[] = [
  {
    id: 'f1',
    index: '01',
    name: 'Formula 1',
    tag: 'Paddock Series',
    accent: '#ff2d2d',
    glow: 'rgba(255,45,45,0.35)',
    headline: 'BUILT FOR THE GRID',
    blurb:
      'A weighty black fleece with race-red stitching, panelled like a piece of paddock equipment.',
    media: '/media/bg-f1.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-f1.mp4',
    intro: 'The pace of race night, translated into a hoodie you can live in.',
    product: {
      name: 'Apex GP Hoodie',
      price: '$420',
      image: '/media/hoodie-f1.png',
      colors: [
        { name: 'Carbon', value: '#0c0c0e' },
        { name: 'Race Red', value: '#ff2d2d' },
        { name: 'Titanium', value: '#c9ccd2' },
      ],
    },
  },
  {
    id: 'anime',
    index: '02',
    name: 'Anime',
    tag: 'Spirit Line',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.35)',
    headline: 'AFTER DARK, IN COLOUR',
    blurb:
      'Electric blue printwork on an inky base. The kind of piece that changes character under city lights.',
    media: '/media/bg-anime.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-anime.mp4',
    intro: 'A neon study in movement, contrast and late-night energy.',
    product: {
      name: 'Ronin Aura Hoodie',
      price: '$380',
      image: '/media/hoodie-anime.png',
      colors: [
        { name: 'Ink', value: '#0c0c14' },
        { name: 'Cyan Surge', value: '#22d3ee' },
        { name: 'Magenta', value: '#e83e8c' },
      ],
    },
  },
  {
    id: 'cars',
    index: '03',
    name: 'Exotic Cars',
    tag: 'Chrome Vault',
    accent: '#d8dde6',
    glow: 'rgba(216,221,230,0.28)',
    headline: 'POLISHED, NOT PRECIOUS',
    blurb:
      'Mirror-bright details, deep graphite tones and a finish that earns a second look.',
    media: '/media/bg-cars.png',
    mediaType: 'image',
    product: {
      name: 'Hypercar Chrome Hoodie',
      price: '$460',
      image: '/media/hoodie-cars.png',
      colors: [
        { name: 'Silver', value: '#c9ccd2' },
        { name: 'Graphite', value: '#3a3d42' },
        { name: 'Onyx', value: '#0c0c0e' },
      ],
    },
  },
  {
    id: 'emirati',
    index: '04',
    name: 'Emirati Culture',
    tag: 'Golden Sands',
    accent: '#e8b552',
    glow: 'rgba(232,181,82,0.3)',
    headline: 'HERITAGE, REFRAMED',
    blurb:
      'Mashrabiya linework in warm gold thread—drawn from the architecture, not borrowed from it.',
    media: '/media/bg-emirati.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-emirati.mp4',
    intro: 'A quiet tribute to the geometry, light and pace of the Emirates.',
    product: {
      name: 'Mashrabiya Gold Hoodie',
      price: '$490',
      image: '/media/hoodie-emirati.png',
      colors: [
        { name: 'Desert Black', value: '#0c0c0e' },
        { name: 'Gold', value: '#e8b552' },
        { name: 'Sand', value: '#d8c9a8' },
      ],
    },
  },
  {
    id: 'fifa',
    index: '05',
    name: 'Final Edition',
    tag: 'Limited Edition',
    accent: '#f5c542',
    glow: 'rgba(245,197,66,0.32)',
    headline: 'FOR THE FINAL MINUTES',
    blurb:
      'Midnight fleece, championship gold and a numbered inside label. Made for the last whistle.',
    media: '/media/bg-fifa.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-fifa.mp4',
    intro: 'One last run under the lights, cut in a strictly limited quantity.',
    product: {
      name: 'Champion \u201826 Hoodie',
      price: '$540',
      image: '/media/hoodie-fifa.png',
      colors: [
        { name: 'Midnight', value: '#0c0c0e' },
        { name: 'Champion Gold', value: '#f5c542' },
        { name: 'Pitch', value: '#1f5c3d' },
      ],
    },
  },
]
