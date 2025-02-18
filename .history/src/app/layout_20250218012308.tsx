import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}

      </body>
    </html>
  )
}