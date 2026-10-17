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

**Foto in "Chi sono":** metti la foto in `public/assets/` e scrivi il percorso in `avatar`
dentro `src/data/config.ts` (es. `"/assets/dario.jpg"`). Finché è vuoto compare il monogramma.

## Form contatti

Copia `.env.example` in `.env.local` e metti la chiave Resend (`RESEND_API_KEY`), la stessa del
sito precedente. Su Vercel vanno nelle variabili d'ambiente del progetto.

## Pubblicazione

Il sito precedente vive nel repository `Dario-portfolio` collegato a Vercel. Per mettere online
questa versione si può sostituire il contenuto di quel repository (il dominio resta lo stesso)
oppure creare un nuovo progetto Vercel e spostarci il dominio.
