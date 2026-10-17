"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { config } from "@/data/config";
import { prefersReducedMotion } from "@/lib/scroll";

/** Larghezza di una striscia, in px CSS. */
const COL = 2;

/**
 * Il nome grande della prima schermata.
 * Il testo vero resta nel DOM (dà la misura e lo legge chi usa uno screen reader);
 * sopra c'è un canvas che lo ridisegna a strisce verticali: dove passa il puntatore
 * le strisce si sfalsano, e quando se ne va tornano al loro posto piano piano.
 */
export default function HeroLogo() {
    const lineRef = useRef<HTMLSpanElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const markRef = useRef<HTMLSpanElement>(null);
    const dotRef = useRef<HTMLSpanElement>(null);
    const [scan, setScan] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const line = lineRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const src = document.createElement("canvas");
        const sctx = src.getContext("2d")!;

        let dpr = 1;
        let em = 100;
        let bx = 0;
        let by = 0;
        let n = 0;
        let amp = new Float32Array(0);
        let phase = new Float32Array(0);
        let speed = new Float32Array(0);
        let jitter = new Float32Array(0);
        let gap = new Uint8Array(0);
        let built = false;

        // disegna il testo, lettera per lettera, nelle posizioni esatte che ha nel DOM
        const build = () => {
            const lr = line.getBoundingClientRect();
            if (!lr.width || !markRef.current) return;
            em = parseFloat(getComputedStyle(line).fontSize) || 100;
            bx = Math.round(em * 0.12);
            by = Math.round(em * 0.32);
            const w = Math.ceil(lr.width + bx * 2);
            const h = Math.ceil(lr.height + by * 2);
            dpr = Math.min(2, window.devicePixelRatio || 1);
            canvas.width = src.width = Math.round(w * dpr);
            canvas.height = src.height = Math.round(h * dpr);
            Object.assign(canvas.style, { left: -bx + "px", top: -by + "px", width: w + "px", height: h + "px" });

            sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            sctx.clearRect(0, 0, w, h);
            sctx.textBaseline = "alphabetic";
            const base = markRef.current.getBoundingClientRect().top - lr.top + by;
            const range = document.createRange();
            line.querySelectorAll<HTMLElement>("[data-seg]").forEach((seg) => {
                const s = getComputedStyle(seg);
                sctx.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
                sctx.fillStyle = s.color;
                const text = seg.firstChild as Text;
                for (let i = 0; i < text.length; i++) {
                    range.setStart(text, i);
                    range.setEnd(text, i + 1);
                    sctx.fillText(text.data[i], range.getBoundingClientRect().left - lr.left + bx, base);
                }
            });

            const cols = Math.ceil(w / COL);
            if (cols !== n) {
                n = cols;
                amp = new Float32Array(n);
                phase = Float32Array.from({ length: n }, () => Math.random() * Math.PI * 2);
                speed = Float32Array.from({ length: n }, () => 2 + Math.random() * 5);
                jitter = Float32Array.from({ length: n }, () => Math.random() * 2 - 1);
                gap = Uint8Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 1 : 0));
            }
            built = true;
            draw(performance.now() / 1000);
        };

        const colX = (i: number) => Math.min(canvas.width, Math.round(i * COL * dpr));

        const draw = (t: number) => {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const ch = canvas.height;
            const shift = em * 0.2 * dpr;
            let run = -1;
            const flush = (end: number) => {
                if (run < 0) return;
                const x = colX(run);
                const w = colX(end) - x;
                if (w > 0) ctx.drawImage(src, x, 0, w, ch, x, 0, w, ch);
                run = -1;
            };
            for (let i = 0; i < n; i++) {
                const a = amp[i];
                if (a < 0.02) {
                    if (run < 0) run = i;
                    continue;
                }
                flush(i);
                // a metà effetto una striscia su due resta vuota, come nelle griglie delle scanimation
                if (gap[i] && a > 0.55) continue;
                const dy = (Math.sin(phase[i] + t * speed[i]) * 0.8 + jitter[i] * 0.3) * a * shift;
                const x = colX(i);
                const w = colX(i + 1) - x;
                if (w > 0) ctx.drawImage(src, x, 0, w, ch, x, Math.round(dy), w, ch);
            }
            flush(n);
        };

        // il puntatore
        let cx = -1e5;
        let cy = -1e5;
        let mouse = false;
        let inside = false;
        let raf = 0;
        let running = false;
        let last = 0;

        const dot = (on: boolean) => {
            const d = dotRef.current;
            if (!d) return;
            d.classList.toggle("is-on", on && mouse);
            d.style.translate = `${cx}px ${cy}px`;
        };

        const step = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
            last = now;
            const t = now / 1000;
            const lr = line.getBoundingClientRect();
            const band = line.parentElement!.getBoundingClientRect();
            inside = cx >= band.left && cx <= band.right && cy >= band.top && cy <= band.bottom;
            dot(inside);
            const px = cx - lr.left + bx;
            const R = em * 0.45;
            const decay = Math.exp(-dt / 0.45);
            let any = false;
            for (let i = 0; i < n; i++) {
                let a = amp[i] * decay;
                if (inside) {
                    const d = Math.abs((i + 0.5) * COL - px) / R;
                    if (d < 1) {
                        const f = 1 - d * d;
                        a = Math.max(a, f * f);
                    }
                }
                amp[i] = a < 0.003 ? 0 : a;
                if (amp[i]) any = true;
            }
            draw(t);
            if (any || inside) raf = requestAnimationFrame(step);
            else running = false;
        };

        const wake = () => {
            if (running || !built) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(step);
        };

        const onMove = (e: PointerEvent) => {
            cx = e.clientX;
            cy = e.clientY;
            mouse = e.pointerType !== "touch";
            const band = line.parentElement!.getBoundingClientRect();
            if (cx >= band.left && cx <= band.right && cy >= band.top && cy <= band.bottom) wake();
            else if (inside) dot(false);
        };
        const onLeave = () => {
            cx = cy = -1e5;
            dot(false);
        };

        // il testo si ridisegna quando cambia la misura, il tema o il font
        let timers: number[] = [];
        const rebuildSoon = () => {
            timers.forEach(clearTimeout);
            timers = [0, 80, 450, 1000].map((ms) => window.setTimeout(build, ms));
        };
        const ro = new ResizeObserver(rebuildSoon);
        ro.observe(line);
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        mql.addEventListener("change", rebuildSoon);
        window.addEventListener("tema", rebuildSoon);
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        let alive = true;
        document.fonts.ready.then(() => {
            if (!alive) return;
            build();
            if (built) setScan(true);
        });

        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            timers.forEach(clearTimeout);
            ro.disconnect();
            mql.removeEventListener("change", rebuildSoon);
            window.removeEventListener("tema", rebuildSoon);
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <h1 className={"hero__logo" + (scan ? " is-scan" : "")}>
            <span className="sr-only">
                {config.author} — {config.role}
            </span>
            <span ref={lineRef} className="hero__logo-line" aria-hidden>
                <span className="hero__logo-serif" data-seg>
                    dario
                </span>
                <span className="hero__logo-sans" data-seg>
                    .elia
                </span>
                <span ref={markRef} className="hero__logo-mark" />
                <canvas ref={canvasRef} className="hero__logo-canvas" />
            </span>
            {mounted && createPortal(<span ref={dotRef} className="logo-dot" aria-hidden />, document.body)}
        </h1>
    );
}
