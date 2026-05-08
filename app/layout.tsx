import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'xtier — Premium Executive Transit | Kingwood to IAH',
  description:
    'Executive airport transportation service connecting Kingwood and the surrounding area to George Bush Intercontinental Airport (IAH). Fixed-route, fixed pricing. Book your seat today.',
  keywords: 'Kingwood airport shuttle, IAH transportation, Kingwood to IAH, executive transit, airport car service',
  openGraph: {
    description: 'Premium fixed-route transportation from Kingwood to IAH with xtier.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
