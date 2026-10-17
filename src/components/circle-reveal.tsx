"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/scroll";

/**
 * Il cerchio nero tra una sezione e l'altra.
 * "in": un punto che si allarga fino a coprire tutto (entrata nei Progetti).
 * "out": lo stesso movimento al contrario, fino a sparire (uscita verso Chi sono).
 */
export default function CircleReveal({ mode }: { mode: "in" | "out" }) {
    const wrap = useRef<HTMLDivElement>(null);
    const dot = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const set = (s: number) => {
            if (dot.current) dot.current.style.transform = `translate(-50%, -50%) scale(${Math.max(0, s)})`;
        };
        const st = ScrollTrigger.create({
            trigger: wrap.current,
            start: "top bottom",
            end: mode === "in" ? "bottom bottom" : "bottom top",
            onUpdate: (self) => {
                const p = self.progress;
                if (mode === "out") {
                    // grande quanto lo schermo all'inizio, un punto a metà, poi niente
                    set(p < 0.55 ? 1 - (p / 0.55) * 0.97 : 0.03 - ((p - 0.55) / 0.2) * 0.03);
                } else {
                    // compare un punto, poi si allarga fino a coprire tutto prima che arrivi la sezione nera
                    set(p < 0.3 ? 0 : p < 0.45 ? ((p - 0.3) / 0.15) * 0.03 : 0.03 + Math.pow((p - 0.45) / 0.5, 1.6) * 0.97);
                }
            },
            onRefresh: (self) => {
                if (mode === "in" && self.progress >= 0.95) set(1);
            },
        });
        return () => st.kill();
    }, [mode]);

    return (
        <div ref={wrap} className={"circle-reveal circle-reveal--" + mode} aria-hidden>
            <div className="circle-reveal__sticky">
                <div ref={dot} className="circle-reveal__dot" style={{ transform: `translate(-50%, -50%) scale(${mode === "in" ? 0 : 1})` }} />
            </div>
        </div>
    );
}
