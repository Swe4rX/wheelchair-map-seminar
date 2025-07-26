import React from "react";

const INVESTORS = [
    {
        name: "Sana Kliniken AG",
        logo: "/investors/sana-de.svg",
        website: "https://www.sana.de/quellenhof-wildbad",
        alt: "Logo von Sana Kliniken AG",
    },
    {
        name: "Bfw Bad Wildbad",
		logo: "/investors/bfw-badwildbad.svg",
        website: "https://bfw-badwildbad.de/",
        alt: "Logo von Bfw Bad Wildbad",
    },
];

export default function CreditsPage() {
  return (
    <>
      <header className="sr-only">
        <h1>Barrierefreie Orte in Bad Wildbad</h1>
        <p>Interaktive Karte mit rollstuhlgerechten Einrichtungen und barrierefreien Orten</p>
      </header>
      <main id="main-content" className="min-h-screen" role="main">
        <section className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Investoren & Unterstützung</h2>
          <p className="text-center text-gray-600 mb-6">
            Vielen Dank an unsere Unterstützer, die dieses Projekt möglich gemacht haben.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INVESTORS.map((inv) => (
              <li key={inv.name} className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-6">
                <img
                  src={inv.logo}
                  alt={inv.alt}
                  className="h-20 w-auto mb-4"
                  loading="lazy"
                />
                <span className="font-semibold text-lg mb-2">{inv.name}</span>
                <a
                  href={inv.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Webseite besuchen
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
