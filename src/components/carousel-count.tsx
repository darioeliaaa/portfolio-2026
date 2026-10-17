"use client";

import { useEffect, useState, type RefObject } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sotto un carosello orizzontale (solo su telefono): a che scheda sei, su quante,
 * e un invito a scorrere. Sullo schermo grande è nascosto dal CSS.
 */
export default function CarouselCount({ target, total }: { target: RefObject<HTMLElement | null>; total: number }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const el = target.current;
        if (!el) return;
        const update = () => {
            const first = el.firstElementChild as HTMLElement | null;
            if (!first) return;
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) return setIndex(total - 1);
            const step = first.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
            setIndex(Math.min(total - 1, Math.round(el.scrollLeft / step)));
        };
        update();
        el.addEventListener("scroll", update, { passive: true });
        return () => el.removeEventListener("scroll", update);
    }, [target, total]);

    return (
        <p className="ccount mono" aria-hidden>
            <span>
                {pad(index + 1)} / {pad(total)}
            </span>
            <span className="ccount__bar">
                <i style={{ width: `${((index + 1) / total) * 100}%` }} />
            </span>
            <span>{index + 1 < total ? "Scorri →" : "← Indietro"}</span>
        </p>
    );
}
