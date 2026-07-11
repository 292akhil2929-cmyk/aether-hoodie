import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })

export const metadata: Metadata = {
  metadataBase: new URL('https://aether-hoodie.vercel.app'),
  title: 'TERRAIN — Wear a world',
  description: 'TERRAIN makes collectible heavyweight hoodies from Dubai: worlds, weather systems, light and movement built into the garment.',
  alternates: { canonical: '/' },
  openGraph: { title: 'TERRAIN — Wear a world', description: 'Limited collectible hoodies, designed in Dubai and released worldwide.', url: '/', siteName: 'TERRAIN', images: [{ url: '/media/terrain-orbit-01.png', width: 1024, height: 1536, alt: 'TERRAIN Orbit hoodie' }], locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'TERRAIN — Wear a world', description: 'Limited collectible hoodies from Dubai.', images: ['/media/terrain-orbit-01.png'] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#080808', colorScheme: 'dark' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${bebas.variable} bg-background`}><body className="antialiased bg-background text-foreground">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
