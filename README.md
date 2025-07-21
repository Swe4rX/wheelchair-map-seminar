# Barrierefreie Orte Bad Wildbad

Dies ist eine interaktive Karte für barrierefreie und rollstuhlgerechte Orte in Bad Wildbad. Das Projekt basiert auf [Next.js](https://nextjs.org) und nutzt moderne Webtechnologien für eine zugängliche, schnelle und benutzerfreundliche Anwendung.

## Projektüberblick

- **Stadt:** Bad Wildbad (Schwarzwald)
- **Ziel:** Übersicht und Bewertung barrierefreier Orte für Menschen mit Mobilitätseinschränkungen
- **Features:**
  - Interaktive Karte mit Suchfunktion
  - Detailansicht mit Bildern, Bewertungen und Beschreibungen
  - Möglichkeit, neue Orte und Bilder hinzuzufügen (passwortgeschützt)
  - Optimiert für Barrierefreiheit (WCAG 2.1 AA)
  - Mobile- und Desktop-optimiert

## Entwicklung starten

1. Installiere die Abhängigkeiten:

```bash
npm install
```

2. Starte den Entwicklungsserver:

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser, um die Anwendung zu sehen.

## Wichtige Dateien & Verzeichnisse

- `src/app/page.tsx` – Startseite mit der Kartenansicht
- `src/components/` – UI-Komponenten (Karte, Sidebar, Galerie, etc.)
- `prisma/schema.prisma` – Datenbankschema (PostgreSQL)
- `.env` – Umgebungsvariablen (z.B. Datenbank, Cloudinary)

## Deployment

Das Projekt ist für die Bereitstellung auf [Vercel](https://vercel.com/) optimiert. Ein Deployment erfolgt automatisch nach jedem Push auf den Hauptbranch.

## Mitwirken & Feedback

- Neue barrierefreie Orte können über die Upload-Seite hinzugefügt werden (Passwort erforderlich).

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

---
