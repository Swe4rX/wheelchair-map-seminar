import './globals.css'
import 'leaflet/dist/leaflet.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      {children}
      <Analytics />
      <SpeedInsights />
      </body>
    </html>
  )
}