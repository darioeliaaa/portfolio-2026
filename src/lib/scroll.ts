"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let locks = 0;

export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll morbido (Lenis) sincronizzato con GSAP ScrollTrigger. */
export function initScroll(): () => void {
    if (prefersReducedMotion()) {
        return () => {};
    }
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (locks > 0) lenis.stop();
    return () => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = null;
    };
}

export const getLenis = () => lenis;

/** Blocca/sblocca lo scroll (intro, finestre di dettaglio). Le richieste si sommano. */
export function lockScroll(lock: boolean) {
    locks = Math.max(0, locks + (lock ? 1 : -1));
    const locked = locks > 0;
    if (lenis) {
        if (locked) lenis.stop();
        else lenis.start();
    }
    document.documentElement.classList.toggle("is-locked", locked);
}

/** Porta alla sezione con quell'id (o in cima con "top"). */
export function scrollToId(id: string) {
    const target = id === "top" ? 0 : document.getElementById(id);
    if (target === null) return;
    if (lenis) {
        lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else if (target === 0) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    } else {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}

export { gsap, ScrollTrigger };
