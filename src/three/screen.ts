import * as THREE from "three";

export type Fonts = { serif: string; mono: string; sans: string };

/** Il codice che si scrive sullo schermo mentre la postazione prende forma. */
const CODE: { t: string; c: string }[][] = [
    [{ t: "// dario.elia — sviluppatore full-stack junior", c: "comment" }],
    [
        { t: "const ", c: "kw" },
        { t: "dario", c: "var" },
        { t: " = {", c: "p" },
    ],
    [
        { t: "  studia", c: "prop" },
        { t: ": ", c: "p" },
        { t: '"Informatica @ Unical"', c: "str" },
        { t: ",", c: "p" },
    ],
    [
        { t: "  backend", c: "prop" },
        { t: ": [", c: "p" },
        { t: '"Java"', c: "str" },
        { t: ", ", c: "p" },
        { t: '"Spring Boot"', c: "str" },
        { t: ", ", c: "p" },
        { t: '"PostgreSQL"', c: "str" },
        { t: "],", c: "p" },
    ],
    [
        { t: "  frontend", c: "prop" },
        { t: ": [", c: "p" },
        { t: '"Angular"', c: "str" },
        { t: ", ", c: "p" },
        { t: '"Next.js"', c: "str" },
        { t: ", ", c: "p" },
        { t: '"Three.js"', c: "str" },
        { t: "],", c: "p" },
    ],
    [
        { t: "  mobile", c: "prop" },
        { t: ": [", c: "p" },
        { t: '"Kotlin"', c: "str" },
        { t: ", ", c: "p" },
        { t: '"Jetpack Compose"', c: "str" },
        { t: "],", c: "p" },
    ],
    [
        { t: "  disponibile", c: "prop" },
        { t: ": ", c: "p" },
        { t: "true", c: "kw" },
        { t: ",", c: "p" },
    ],
    [{ t: "};", c: "p" }],
    [],
    [
        { t: "deploy", c: "fn" },
        { t: "(", c: "p" },
        { t: "dario", c: "var" },
        { t: ");", c: "p" },
        { t: " // dal primo pixel al deploy ✓", c: "comment" },
    ],
];

const SYNTAX: Record<string, string> = {
    comment: "#6f7c8f",
    kw: "#c792ea",
    var: "#eeffff",
    prop: "#82aaff",
    str: "#c3e88d",
    p: "#c8ced8",
    fn: "#ffcb6b",
};

export const CODE_LENGTH = CODE.reduce((n, line) => n + line.reduce((m, s) => m + s.t.length, 0) + 1, 0);

export class ScreenTexture {
    readonly texture: THREE.CanvasTexture;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly w = 1600;
    private readonly h = 1040;
    private last = "";

    constructor(private fonts: Fonts) {
        const c = document.createElement("canvas");
        c.width = this.w;
        c.height = this.h;
        this.ctx = c.getContext("2d")!;
        this.texture = new THREE.CanvasTexture(c);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        this.texture.anisotropy = 8;
        this.draw({ mode: "ciao", reveal: 0, chars: 0, caret: true });
    }

    /** Ridisegna solo se qualcosa è cambiato. */
    draw(state: { mode: "ciao" | "code"; reveal: number; chars: number; caret: boolean }) {
        const key = `${state.mode}|${state.mode === "ciao" ? state.reveal.toFixed(3) : state.chars}|${state.caret}`;
        if (key === this.last) return;
        this.last = key;
        const { ctx, w, h } = this;
        this.wallpaper();
        if (state.mode === "ciao") this.ciao(state.reveal);
        else this.editor(state.chars, state.caret);
        this.menuBar();
        // notch della fotocamera
        ctx.fillStyle = "#000";
        roundRect(ctx, w / 2 - 92, -20, 184, 56, 16);
        ctx.fill();
        this.texture.needsUpdate = true;
        void h;
    }

    private wallpaper() {
        const { ctx, w, h } = this;
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#1b2433");
        g.addColorStop(0.55, "#2d3a52");
        g.addColorStop(1, "#4b5a74");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        // onde morbide sullo sfondo
        ctx.globalAlpha = 0.18;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, h * (0.55 + i * 0.1));
            ctx.bezierCurveTo(w * 0.3, h * (0.35 + i * 0.12), w * 0.65, h * (0.85 + i * 0.05), w, h * (0.5 + i * 0.1));
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = i % 2 ? "#8fa3c4" : "#c4d0e3";
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    private menuBar() {
        const { ctx, w } = this;
        ctx.fillStyle = "rgba(10, 14, 22, 0.55)";
        ctx.fillRect(0, 0, w, 40);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `600 22px ${this.fonts.sans}`;
        ctx.textBaseline = "middle";
        ctx.fillText("Code", 40, 21);
        ctx.font = `400 22px ${this.fonts.sans}`;
        ["File", "Modifica", "Vista", "Terminale"].forEach((t, i) => ctx.fillText(t, 120 + i * 110, 21));
        ctx.textAlign = "right";
        ctx.fillText("Calabria · 09:41", w - 40, 21);
        ctx.textAlign = "left";
    }

    /** "ciao" scritto a mano, che compare da sinistra a destra. */
    private ciao(reveal: number) {
        const { ctx, w, h } = this;
        ctx.save();
        ctx.fillStyle = "#f4f1ea";
        roundRect(ctx, w * 0.17, h * 0.2, w * 0.66, h * 0.62, 26);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(w * 0.17, h * 0.2, w * 0.66 * Math.min(1, Math.max(0, reveal)), h * 0.62);
        ctx.clip();
        ctx.fillStyle = "#141414";
        ctx.font = `italic 400 300px ${this.fonts.serif}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ciao", w / 2, h * 0.5);
        ctx.restore();
        // piccolo segno di firma sotto
        ctx.fillStyle = "rgba(20,20,20,0.45)";
        ctx.font = `400 26px ${this.fonts.mono}`;
        ctx.textAlign = "center";
        if (reveal > 0.98) ctx.fillText("— dario.elia", w / 2, h * 0.74);
        ctx.textAlign = "left";
    }

    private editor(chars: number, caret: boolean) {
        const { ctx, w, h } = this;
        const x0 = w * 0.08;
        const y0 = 84;
        const ew = w * 0.84;
        const eh = h - 150;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 14;
        ctx.fillStyle = "#1e222a";
        roundRect(ctx, x0, y0, ew, eh, 18);
        ctx.fill();
        ctx.restore();
        // barra della finestra
        ctx.fillStyle = "#262b35";
        roundRect(ctx, x0, y0, ew, 54, 18);
        ctx.fill();
        ctx.fillRect(x0, y0 + 30, ew, 24);
        ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(x0 + 30 + i * 30, y0 + 27, 9, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.fillStyle = "#9aa4b5";
        ctx.font = `400 22px ${this.fonts.mono}`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText("dario.ts — portfolio", x0 + ew / 2, y0 + 28);
        ctx.textAlign = "left";

        // codice
        const lh = 52;
        const left = x0 + 96;
        let y = y0 + 110;
        let remaining = Math.max(0, chars);
        let caretX = left;
        let caretY = y;
        let caretSet = false;
        CODE.forEach((line, i) => {
            ctx.fillStyle = "#4b5263";
            ctx.font = `400 30px ${this.fonts.mono}`;
            ctx.textAlign = "right";
            ctx.fillText(String(i + 1), x0 + 66, y);
            ctx.textAlign = "left";
            const lineLen = line.reduce((n, s) => n + s.t.length, 0);
            let budget = Math.min(lineLen, remaining);
            let x = left;
            for (const seg of line) {
                if (budget <= 0) break;
                const part = seg.t.slice(0, budget);
                budget -= part.length;
                ctx.fillStyle = SYNTAX[seg.c];
                ctx.font = `${seg.c === "comment" ? "italic " : ""}400 30px ${this.fonts.mono}`;
                ctx.fillText(part, x, y);
                x += ctx.measureText(part).width;
            }
            if (!caretSet && remaining <= lineLen) {
                caretX = x;
                caretY = y;
                caretSet = true;
                remaining = 0;
            } else if (!caretSet) {
                remaining -= lineLen + 1; // a capo
                caretX = x;
                caretY = y;
            }
            y += lh;
        });
        if (caret) {
            ctx.fillStyle = "#ffcc66";
            ctx.fillRect(caretX + 2, caretY - 18, 14, 36);
        }
        // barra di stato
        ctx.fillStyle = "#2b6cb0";
        ctx.fillRect(x0, y0 + eh - 34, ew, 34);
        ctx.fillStyle = "#e8f0ff";
        ctx.font = `400 19px ${this.fonts.mono}`;
        ctx.fillText("main ✓   TypeScript   UTF-8", x0 + 22, y0 + eh - 17);
        ctx.textAlign = "right";
        ctx.fillText(chars >= CODE_LENGTH ? "build riuscita" : "in scrittura…", x0 + ew - 22, y0 + eh - 17);
        ctx.textAlign = "left";
    }
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
