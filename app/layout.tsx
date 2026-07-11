import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })

export const metadata: Metadata = {
  metadataBase: new URL('https://aether-hoodie.vercel.app'),
  title: 'ÆTHER atelier — Limited hoodies, designed in Dubai',
  description:
    'ÆTHER creates numbered hoodies with a cinematic point of view. Five limited studies, designed in Dubai and released worldwide.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ÆTHER atelier',
    description: 'Limited hoodies, designed in Dubai and released worldwide.',
    url: '/',
    siteName: 'ÆTHER atelier',
    images: [{ url: '/media/hoodie-hero.png', width: 1200, height: 1200, alt: 'ÆTHER Apex GP hoodie' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'ÆTHER atelier', description: 'Limited hoodies, designed in Dubai and released worldwide.', images: ['/media/hoodie-hero.png'] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} bg-background`}>
      <body className="antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
