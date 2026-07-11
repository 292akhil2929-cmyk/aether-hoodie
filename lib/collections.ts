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
    headline: 'ENGINEERED FOR SPEED',
    blurb:
      'Carbon weave, aerodynamic seams, and race-red stitching. Built in the paddock, worn on the grid.',
    media: '/media/bg-f1.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-f1.mp4',
    intro: 'A LaFerrari tears across the tarmac and dissolves into thread. Scroll to watch it arrive.',
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
    headline: 'SUMMON YOUR AURA',
    blurb:
      'Neon brush strokes and electric energy. Every drop channels a different spirit through the fabric.',
    media: '/media/bg-anime.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-anime.mp4',
    intro: 'Reality bends and repaints itself in neon ink. Scroll to cross into the anime dimension.',
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
    headline: 'LIQUID CHROME LUXURY',
    blurb:
      'Mirror-polished detailing inspired by the world\u2019s most exclusive machines. Showroom to street.',
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
    headline: 'GOLD OF THE DESERT',
    blurb:
      'Mashrabiya geometry rendered in gold thread. A modern tribute to heritage and horizon.',
    media: '/media/bg-emirati.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-emirati.mp4',
    intro: 'From golden dunes to a glittering skyline. Scroll to travel across the desert.',
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
    name: 'FIFA World Cup',
    tag: 'Limited Edition',
    accent: '#f5c542',
    glow: 'rgba(245,197,66,0.32)',
    headline: 'LIFT THE TROPHY',
    blurb:
      'The final-whistle drop. Champion gold on midnight black \u2014 numbered, sealed, and unrepeatable.',
    media: '/media/bg-fifa.png',
    mediaType: 'image',
    scrollVideo: '/media/scroll-fifa.mp4',
    intro: 'The stadium roars and the drop is unveiled under the lights. Scroll to lift the trophy.',
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
