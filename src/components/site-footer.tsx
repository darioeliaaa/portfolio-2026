"use client";

import { usePathname } from "next/navigation";
import { config } from "@/data/config";
import { scrollToId } from "@/lib/scroll";

export default function SiteFooter() {
    const pathname = usePathname();
    return (
        <footer className="site-footer">
            <span>
                {config.author} <span aria-hidden>✳</span> <span className="paren">2023 – presente</span>
            </span>
            <span className="site-footer__credit">Progettato e scritto in Calabria, su un MacBook Air M4</span>
            {pathname === "/" ? (
                <button type="button" className="paren" onClick={() => scrollToId("top")}>
                    Torna su
                </button>
            ) : (
                <a href="/" className="paren">
                    Home
                </a>
            )}
        </footer>
    );
}
