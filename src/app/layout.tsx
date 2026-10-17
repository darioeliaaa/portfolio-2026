import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { config, indexable } from "@/data/config";
import AppShell from "@/components/app-shell";
import "./base.css";
import "./site.css";
import "./sections.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const instrument = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-instrument",
    display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
    metadataBase: new URL(config.site),
    title: {
        default: config.title,
        template: `%s | ${config.author}`,
    },
    description: config.description.meta,
    keywords: config.keywords,
    applicationName: config.author,
    authors: [{ name: config.author, url: config.site }],
    creator: config.author,
    alternates: { canonical: "/" },
    // Verifica della proprietà del sito su Google Search Console.
    verification: { google: "Ex-Sw0RFL2YbsepMyz5QqGvwntIHu6JSlWECf_kVeK8" },
    openGraph: {
        title: config.title,
        description: config.description.meta,
        url: config.site,
        siteName: config.author,
        locale: "it_IT",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: config.title,
        description: config.description.meta,
    },
    // il nome sotto l'icona quando lo aggiungi alla Home dell'iPhone (altrimenti usa il titolo, tagliato)
    appleWebApp: { title: config.author, capable: true, statusBarStyle: "default" },
    formatDetection: { telephone: false },
    robots: indexable
        ? {
              index: true,
              follow: true,
              googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
          }
        : { index: false, follow: false },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f1f1f1" },
        { media: "(prefers-color-scheme: dark)", color: "#0e0e0e" },
    ],
};

/**
 * Dati strutturati (schema.org) per Google: il sito si chiama "Dario Elia"
 * (è il nome che mostra sopra il risultato al posto del dominio) ed è di una
 * persona, Dario Elia, che è la stessa dei profili LinkedIn, GitHub e Instagram.
 */
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${config.site}/#sito`,
            url: config.site,
            name: config.author,
            alternateName: ["dario.elia", "darioelia.it"],
            inLanguage: "it-IT",
            publisher: { "@id": `${config.site}/#dario` },
        },
        {
            "@type": "Person",
            "@id": `${config.site}/#dario`,
            name: config.author,
            givenName: "Dario",
            familyName: "Elia",
            url: config.site,
            image: `${config.site}${config.avatar}`,
            jobTitle: config.role,
            description: config.description.short,
            address: { "@type": "PostalAddress", addressRegion: "Calabria", addressCountry: "IT" },
            affiliation: { "@type": "CollegeOrUniversity", name: "Università della Calabria", url: "https://www.unical.it" },
            knowsAbout: [
                "Java",
                "Spring Boot",
                "Spring Security",
                "Keycloak",
                "Angular",
                "TypeScript",
                "Next.js",
                "Kotlin",
                "Jetpack Compose",
                "Android",
                "PostgreSQL",
                "Docker",
                "Three.js",
            ],
            sameAs: Object.values(config.social).filter(Boolean),
        },
    ],
};

// Prima del primo disegno: tema scelto e classe "js" (attiva le comparse allo scroll).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('tema');if(t==='dark'||t==='light')d.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="it"
            className={[inter.variable, instrument.variable, jetbrains.variable].join(" ")}
            suppressHydrationWarning
        >
            <head>
                <Script id="avvio" strategy="beforeInteractive">
                    {bootScript}
                </Script>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <a className="skip-link" href="#contenuto">
                    Vai al contenuto
                </a>
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
