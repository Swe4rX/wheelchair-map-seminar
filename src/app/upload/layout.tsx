import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neuen Ort hinzufügen | Barrierefreie Orte Bad Wildbad',
  description: 'Fügen Sie einen neuen barrierefreien Ort in Bad Wildbad hinzu. Helfen Sie dabei, die Karte für Menschen mit Mobilitätseinschränkungen zu verbessern.',
  robots: 'noindex, nofollow', // Upload page should not be indexed
}

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sr-only">
        <h1>Neuen barrierefreien Ort hinzufügen</h1>
        <p>Formular zum Hinzufügen von barrierefreien Orten in Bad Wildbad</p>
      </header>
      <main role="main">
        {children}
      </main>
    </>
  )
}
