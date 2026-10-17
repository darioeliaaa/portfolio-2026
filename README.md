# darioelia.it — versione 2

Il portfolio di Dario Elia, seconda versione: impianto editoriale a colonne, un MacBook Air M4
(Midnight) modellato in Three.js che all'apertura scrive "ciao" e, scorrendo, si ritrova su una
postazione da programmatore che si costruisce oggetto dopo oggetto.

## Avvio in locale

```bash
npm install
npm run dev        # http://localhost:3500
npm run build      # build di produzione
```

## Dove stanno le cose

| Cosa | File |
|---|---|
| Nome, ruoli, testi brevi, link social, Calendly, CV, foto | `src/data/config.ts` |
| Skill (37) e loro descrizioni, percorso di studio ed esperienze | `src/data/skill-keys.ts`, `src/data/constants.ts` |
| Progetti (universitari, lavori, dimostrativi) | `src/data/projects.tsx` |
| Gallerie delle schermate | `src/data/galleries.ts` + `public/assets/gallery/` |
| Listino | `src/data/pricing-plans.ts` |
| Curriculum (pagina /cv) | `src/app/cv/cv-data.ts` + `public/Dario_Elia_CV.pdf` |
| Scena 3D (MacBook, scrivania, oggetti) | `src/three/` |
| Stile | `src/app/base.css`, `site.css`, `sections.css` |

**Foto in "Chi sono":** è `public/assets/dario.jpg` (bianco e nero, senza dati GPS), indicata in
`avatar` dentro `src/data/config.ts`. Se la togli da lì compare il monogramma.

## Anteprime, icone e Google

| Cosa | File |
|---|---|
| Anteprima quando mandi il link (WhatsApp, LinkedIn, Telegram...) | `src/app/opengraph-image.tsx`, `src/app/cv/opengraph-image.tsx`, disegno in `src/lib/og.tsx` |
| MacBook dell'anteprima (render della scena 3D, sfondo trasparente) | `src/assets/og/macbook.png` |
| Icone: scheda del browser, Home di iPhone e Android, `favicon.ico` | `src/app/icon.tsx`, `apple-icon.tsx`, `icon-maskable.png/`, `favicon.ico`, `manifest.ts` |
| Titolo e descrizione nei risultati di Google | `config.title` e `config.description.meta` in `src/data/config.ts` |
| Dati strutturati (nome del sito, persona, profili social) | `src/app/layout.tsx` |
| Sitemap e robots | `src/app/sitemap.ts`, `src/app/robots.ts` |

Le anteprime dei branch su Vercel escono da sole da Google (`noindex`): conta solo la produzione.

## Form contatti

Copia `.env.example` in `.env.local` e metti la chiave Resend (`RESEND_API_KEY`), la stessa del
sito precedente. Su Vercel vanno nelle variabili d'ambiente del progetto.

## Pubblicazione (progetto Vercel nuovo)

Il dominio `darioelia.it` è registrato su Aruba e punta già a Vercel (A `216.198.79.1` sul dominio,
CNAME su `www`): su Aruba non si tocca niente, si sposta il dominio da un progetto Vercel all'altro.

1. Carica questa cartella su un repository GitHub nuovo e importalo su Vercel (Add New → Project).
2. In Settings → Environment Variables metti `RESEND_API_KEY`, `CONTACT_TO_EMAIL` e
   `CONTACT_FROM_EMAIL`, gli stessi valori del progetto vecchio.
3. Apri il link `.vercel.app` che ti dà Vercel e controlla tutto, anche il form.
4. Progetto vecchio → Settings → Domains: rimuovi `www.darioelia.it` e `darioelia.it`.
5. Progetto nuovo → Settings → Domains: aggiungi `www.darioelia.it` (principale) e `darioelia.it`
   con redirect verso `www`.

## Google

1. Search Console: la verifica è già nel sito (meta `google-site-verification` in `layout.tsx`),
   quindi la proprietà resta verificata.
2. Sitemap → invia `https://www.darioelia.it/sitemap.xml`.
3. Controllo URL → `https://www.darioelia.it/` → "Richiedi indicizzazione" (e lo stesso per `/cv`).
4. Il link a `www.darioelia.it` va su LinkedIn, GitHub e Instagram: sono gli stessi profili
   indicati nei dati strutturati, e insieme dicono a Google che il sito è di "Dario Elia".
