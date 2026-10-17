"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initScroll, ScrollTrigger } from "@/lib/scroll";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import Toaster from "./toaster";
import EasterEggs from "./easter-eggs";

/** Guscio comune a tutte le pagine: scroll morbido, griglia, header, footer, comparse. */
export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => initScroll(), []);

    // Comparse allo scroll: ogni elemento con data-reveal entra una volta sola.
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-in");
                        io.unobserve(e.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
        );
        const scan = (root: ParentNode) =>
            root.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
        scan(document);
        const mo = new MutationObserver((list) => {
            for (const m of list) m.addedNodes.forEach((n) => n instanceof Element && scan(n.parentNode ?? n));
        });
        mo.observe(document.body, { childList: true, subtree: true });
        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, [pathname]);

    // Dopo il caricamento di font e immagini le altezze cambiano: ricalcola i trigger.
    useEffect(() => {
        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener("load", refresh);
        return () => window.removeEventListener("load", refresh);
    }, [pathname]);

    return (
        <>
            <div className="grid-lines" aria-hidden>
                <i />
                <i />
                <i />
                <i />
            </div>
            <SiteHeader />
            <main id="contenuto">{children}</main>
            <SiteFooter />
            <Toaster />
            <EasterEggs />
        </>
    );
}
