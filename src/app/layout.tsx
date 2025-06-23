import './globals.css'
import 'leaflet/dist/leaflet.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import React from "react";
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Barrierefreie Orte in Bad Wildbad | Rollstuhlkarte',
  description: 'Entdecken Sie barrierefreie Orte und rollstuhlgerechte Einrichtungen in Bad Wildbad. Interaktive Karte mit detaillierten Informationen zur Zugänglichkeit für Menschen mit Mobilitätseinschränkungen.',
  keywords: ['Bad Wildbad', 'barrierefrei', 'Rollstuhl', 'Zugänglichkeit', 'Mobilität', 'behindertengerecht', 'Karte', 'Schwarzwald'],
  authors: [{ name: 'Bad Wildbad Barrierefreiheits-Team' }],
  creator: 'Bad Wildbad Barrierefreiheits-Team',
  publisher: 'Bad Wildbad',
  robots: 'index, follow',
  metadataBase: new URL('https://wheelchair-map.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Barrierefreie Orte in Bad Wildbad | Rollstuhlkarte',
    description: 'Entdecken Sie barrierefreie Orte und rollstuhlgerechte Einrichtungen in Bad Wildbad. Interaktive Karte mit detaillierten Informationen zur Zugänglichkeit.',
    url: 'https://wheelchair-map.vercel.app',
    siteName: 'Bad Wildbad Barrierefreiheitskarte',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Barrierefreie Karte von Bad Wildbad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barrierefreie Orte in Bad Wildbad | Rollstuhlkarte',
    description: 'Entdecken Sie barrierefreie Orte und rollstuhlgerechte Einrichtungen in Bad Wildbad.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'c7bccf03d23558e8',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="google-site-verification" content="c7bccf03d23558e8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Barrierefreie Orte Bad Wildbad",
              "description": "Interaktive Karte mit barrierefreien Orten und rollstuhlgerechten Einrichtungen in Bad Wildbad",
              "url": "https://wheelchair-map.vercel.app",
              "applicationCategory": "NavigationApplication",
              "operatingSystem": "Web Browser",
              "inLanguage": "de-DE",
              "serviceType": "Accessibility Information",
              "areaServed": {
                "@type": "City",
                "name": "Bad Wildbad",
                "addressCountry": "DE",
                "addressRegion": "Baden-Württemberg"
              },
              "provider": {
                "@type": "Organization",
                "name": "Bad Wildbad Barrierefreiheits-Team"
              },
              "keywords": ["Barrierefreiheit", "Rollstuhl", "Zugänglichkeit", "Bad Wildbad", "Navigation"]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-[10000] focus:z-[10000]"
        >
          Zum Hauptinhalt springen
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}