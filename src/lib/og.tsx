import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Font per le immagini generate (anteprima social e icone). Licenza SIL OFL. */
export async function ogFonts() {
    const dir = join(process.cwd(), "src/app/fonts");
    const [serif, sans, mono] = await Promise.all([
        readFile(join(dir, "InstrumentSerif-Italic.ttf")),
        readFile(join(dir, "Inter-Medium.ttf")),
        readFile(join(dir, "JetBrainsMono-Regular.ttf")),
    ]);
    return [
        { name: "Serif", data: serif, style: "italic" as const, weight: 400 as const },
        { name: "Sans", data: sans, style: "normal" as const, weight: 500 as const },
        { name: "Mono", data: mono, style: "normal" as const, weight: 400 as const },
    ];
}

/**
 * Le immagini che finiscono dentro le anteprime, come data URI: il MacBook
 * (render della scena 3D, sfondo trasparente) e la foto di "Chi sono".
 * Percorsi scritti per esteso, così la build sa esattamente quali file servono.
 */
export async function ogPicture(name: "macbook" | "foto") {
    if (name === "macbook") {
        const data = await readFile(join(process.cwd(), "src/assets/og/macbook.png"));
        return `data:image/png;base64,${data.toString("base64")}`;
    }
    const data = await readFile(join(process.cwd(), "public/assets/dario.jpg"));
    return `data:image/jpeg;base64,${data.toString("base64")}`;
}

const INK = "#141414";
const PAPER = "#f1f1f1";
const MUTED = "#5c5c5c";
const LINE = "rgba(20,20,20,0.13)";

/** L'asterisco di "Disponibile", come nell'header del sito. */
function Asterisk() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ marginRight: 10 }}>
            {[0, 45, 90, 135].map((a) => (
                <line key={a} x1="10" y1="1" x2="10" y2="19" stroke={INK} strokeWidth="1.6" transform={`rotate(${a} 10 10)`} />
            ))}
        </svg>
    );
}

type Visual = { kind: "macbook"; src: string } | { kind: "photo"; src: string };

/**
 * Anteprima social (1200×630): la prima schermata del sito in piccolo.
 * Carta grigia, linee di colonna, il logotipo nella fascia e sotto il MacBook
 * (o la foto, per il CV). Al centro c'è tutto quello che serve anche quando
 * WhatsApp o Telegram tagliano l'immagine a quadrato.
 */
export function OgCard({ title, side, foot, visual }: { title?: string; side: string[]; foot: string; visual: Visual }) {
    const cols = [133, 444, 756, 1067];
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, position: "relative", color: INK, fontFamily: "Sans" }}>
            {/* in alto, come l'header */}
            <div style={{ position: "absolute", left: 40, top: 34, fontSize: 22 }}>Dario Elia</div>
            <div style={{ position: "absolute", right: 40, top: 34, display: "flex", alignItems: "center", fontSize: 22 }}>
                <Asterisk />
                Disponibile per nuovi progetti
            </div>

            {/* il logotipo nella sua fascia */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 106,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    fontSize: 196,
                    lineHeight: 1,
                }}
            >
                {title ? (
                    <span style={{ fontFamily: "Serif", fontStyle: "italic", letterSpacing: -6 }}>{title}</span>
                ) : (
                    <>
                        <span style={{ fontFamily: "Serif", fontStyle: "italic", letterSpacing: -6 }}>dario</span>
                        <span style={{ letterSpacing: -13 }}>.elia</span>
                    </>
                )}
            </div>

            {/* sotto: al centro l'oggetto, a sinistra cosa faccio; chi sono sotto, o a destra se c'è posto */}
            {visual.kind === "macbook" ? (
                <img src={visual.src} width={420} height={282} style={{ position: "absolute", left: 390, top: 330 }} alt="" />
            ) : (
                <div style={{ position: "absolute", left: 496, top: 340, width: 208, height: 260, display: "flex", border: `1px solid ${LINE}` }}>
                    <img src={visual.src} width={208} height={260} alt="" />
                    <div
                        style={{
                            position: "absolute",
                            left: -1,
                            top: -1,
                            padding: "2px 7px",
                            background: PAPER,
                            border: `1px solid ${LINE}`,
                            fontFamily: "Mono",
                            fontSize: 12,
                        }}
                    >
                        dario.jpg
                    </div>
                </div>
            )}

            <div style={{ position: "absolute", left: 137, top: 332, display: "flex", flexDirection: "column", fontSize: 22, lineHeight: 1.45 }}>
                <span>+Full-Stack Developer</span>
                <span>+Web &amp; App Mobile</span>
                <span>+Backend &amp; Web 3D</span>
            </div>
            <div
                style={{
                    position: "absolute",
                    left: visual.kind === "macbook" ? 137 : 760,
                    top: visual.kind === "macbook" ? 460 : 336,
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "Mono",
                    fontSize: 17,
                    lineHeight: 1.6,
                    color: MUTED,
                }}
            >
                {side.map((s) => (
                    <span key={s}>{s}</span>
                ))}
            </div>
            <div style={{ position: "absolute", right: 136, bottom: 34, fontFamily: "Mono", fontSize: 17, color: MUTED }}>{foot}</div>

            {/* le linee per ultime, sopra a tutto come nel sito */}
            {cols.map((x) => (
                <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1, background: LINE }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 1, background: LINE }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 314, height: 1, background: LINE }} />
        </div>
    );
}

/**
 * L'icona: la "d" corsiva col punto, come l'inizio del logotipo, chiara su nero.
 * `glyph` è quanto è grande la lettera rispetto al lato; `radius` arrotonda gli
 * angoli (0 dove ci pensa il sistema, come sull'iPhone o nelle icone "maskable").
 */
export function IconArt({ size, glyph = 0.78, radius = 0 }: { size: number; glyph?: number; radius?: number }) {
    const fs = Math.round(size * glyph);
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: INK,
                color: PAPER,
                borderRadius: Math.round(size * radius),
            }}
        >
            <div style={{ display: "flex", alignItems: "baseline", marginTop: -Math.round(fs * 0.1), marginLeft: -Math.round(fs * 0.03) }}>
                <span style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: fs, lineHeight: 1 }}>d</span>
                <span style={{ fontFamily: "Sans", fontSize: fs, lineHeight: 1 }}>.</span>
            </div>
        </div>
    );
}
