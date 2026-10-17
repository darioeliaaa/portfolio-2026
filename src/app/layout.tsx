import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { config } from "@/data/config";
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
    description: config.description.long,
    keywords: config.keywords,
    authors: [{ name: config.author, url: config.site }],
    creator: config.author,
    alternates: { canonical: "/" },
    // Verifica della proprietà del sito su Google Search Console.
    verification: { google: "Ex-Sw0RFL2YbsepMyz5QqGvwntIHu6JSlWECf_kVeK8" },
    openGraph: {
        title: config.title,
        description: config.description.short,
        url: config.site,
        siteName: config.author,
        locale: "it_IT",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: config.title,
        description: config.description.short,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f1f1f1" },
        { media: "(prefers-color-scheme: dark)", color: "#0e0e0e" },
    ],
};

/** Schema.org Person: aiuta i motori di ricerca a mostrare una scheda corretta. */
const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.author,
    url: config.site,
    jobTitle: config.role,
    description: config.description.short,
    image: `${config.site}/opengraph-image`,
    address: { "@type": "PostalAddress", addressCountry: "IT" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Università della Calabria" },
    knowsAbout: config.keywords,
    sameAs: Object.values(config.social).filter(Boolean),
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
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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
