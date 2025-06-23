import dynamic from 'next/dynamic';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barrierefreie Orte in Bad Wildbad | Rollstuhlkarte',
  description: 'Entdecken Sie barrierefreie Orte und rollstuhlgerechte Einrichtungen in Bad Wildbad. Interaktive Karte mit detaillierten Informationen zur Zugänglichkeit für Menschen mit Mobilitätseinschränkungen.',
}

const LocationMapWrapper = dynamic(() => import('@/components/location-map-wrapper'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Karte wird geladen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" aria-hidden="true"></div>
      <span className="sr-only">Karte wird geladen...</span>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <header className="sr-only">
        <h1>Barrierefreie Orte in Bad Wildbad</h1>
        <p>Interaktive Karte mit rollstuhlgerechten Einrichtungen und barrierefreien Orten</p>
      </header>
      <main id="main-content" className="min-h-screen" role="main">
        <LocationMapWrapper />
      </main>
    </>
  )
}