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

/** Anteprima social: carta grigia, linee di colonna e il logotipo. */
export function OgCard({ title, subtitle }: { title?: string; subtitle: string }) {
    const lines = [133, 444, 756, 1067];
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", background: "#f1f1f1", position: "relative", color: "#141414" }}>
            {lines.map((x) => (
                <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1, background: "rgba(128,128,128,0.3)" }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 1, background: "rgba(128,128,128,0.3)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 360, height: 1, background: "rgba(128,128,128,0.3)" }} />
            <div style={{ position: "absolute", left: 40, top: 40, fontFamily: "Sans", fontSize: 22 }}>Dario Elia</div>
            <div style={{ position: "absolute", right: 40, top: 40, fontFamily: "Sans", fontSize: 22 }}>Disponibile per nuovi progetti</div>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 128,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    fontSize: 210,
                    lineHeight: 1,
                }}
            >
                {title ? (
                    <span style={{ fontFamily: "Serif", fontStyle: "italic", letterSpacing: -6 }}>{title}</span>
                ) : (
                    <>
                        <span style={{ fontFamily: "Serif", fontStyle: "italic", letterSpacing: -6 }}>dario</span>
                        <span style={{ fontFamily: "Sans", letterSpacing: -14 }}>.elia</span>
                    </>
                )}
            </div>
            <div style={{ position: "absolute", left: 136, top: 384, display: "flex", gap: 0, fontFamily: "Sans", fontSize: 24 }}>
                <span style={{ width: 311 }}>+Full-Stack Developer</span>
                <span style={{ width: 311 }}>+Web &amp; App Mobile</span>
                <span>+Backend &amp; Web 3D</span>
            </div>
            <div style={{ position: "absolute", left: 136, right: 136, bottom: 60, display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 20, color: "#5c5c5c" }}>
                <span>{subtitle}</span>
                <span>darioelia.it</span>
            </div>
        </div>
    );
}
