"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/data/config";
import { themeDisclaimers } from "@/data/constants";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { getTheme, setTheme, toast, type Theme } from "@/lib/ui";

export const NAV = [
    { id: "skills", label: "Skills" },
    { id: "progetti", label: "Progetti" },
    { id: "chi-sono", label: "Chi sono" },
    { id: "tariffe", label: "Tariffe" },
    { id: "contatti", label: "Contatti" },
];

const SOCIAL = [
    { href: config.social.github, label: "GitHub" },
    { href: config.social.linkedin, label: "LinkedIn" },
    { href: config.social.instagram, label: "Instagram" },
];

function Spark() {
    return (
        <svg className="spark" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
    );
}

export default function SiteHeader() {
    const pathname = usePathname();
    const home = pathname === "/";
    const [open, setOpen] = useState(false);
    const [theme, setThemeState] = useState<Theme>("light");
    const [current, setCurrent] = useState<string | null>(null);

    useEffect(() => setThemeState(getTheme()), []);

    // Sezione corrente, per sottolinearla nel menu
    useEffect(() => {
        if (!home) return;
        const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
        const inView = new Set<string>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) inView.add(e.target.id);
                    else inView.delete(e.target.id);
                }
                const hit = NAV.map((n) => n.id).filter((id) => inView.has(id));
                setCurrent(hit.length ? hit[hit.length - 1] : null);
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        sections.forEach((s) => io.observe(s));
        return () => io.disconnect();
    }, [home]);

    useEffect(() => {
        if (!open) return;
        lockScroll(true);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            lockScroll(false);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const go = (id: string) => (e: React.MouseEvent) => {
        if (!home) return; // da /cv il link porta alla home con l'ancora
        e.preventDefault();
        setOpen(false);
        // chiudendo il menu lo scroll si sblocca nel frame dopo
        requestAnimationFrame(() => scrollToId(id));
    };

    const toggleTheme = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        setThemeState(next);
        const list = themeDisclaimers[next];
        toast({ title: list[Math.floor(Math.random() * list.length)] });
    };

    return (
        <>
            <header className="site-header">
                <Link href="/" className="site-header__brand" onClick={go("top")}>
                    Dario Elia
                </Link>
                <nav className="site-header__nav" aria-label="Sezioni">
                    {NAV.map((n) => (
                        <a
                            key={n.id}
                            href={`/#${n.id}`}
                            onClick={go(n.id)}
                            className={"paren" + (current === n.id ? " is-current" : "")}
                            aria-current={current === n.id ? "true" : undefined}
                        >
                            {n.label}
                        </a>
                    ))}
                </nav>
                <div className="site-header__end">
                    <Link href="/cv" className="paren site-header__cv">
                        CV
                    </Link>
                    <button type="button" className="paren site-header__theme" onClick={toggleTheme} aria-label="Cambia tema">
                        {theme === "dark" ? "Chiaro" : "Scuro"}
                    </button>
                    {config.available && (
                        <span className="site-header__status" title={config.availabilityLabel}>
                            <Spark />
                            <span className="site-header__status-long">{config.availabilityLabel}</span>
                            <span className="site-header__status-short">Disponibile</span>
                        </span>
                    )}
                    <button
                        type="button"
                        className="paren site-header__menu"
                        onClick={() => setOpen(true)}
                        aria-expanded={open}
                        aria-controls="menu-mobile"
                    >
                        Menu
                    </button>
                </div>
            </header>

            <div id="menu-mobile" className={"menu" + (open ? " is-open" : "")} aria-hidden={!open} inert={!open}>
                <div className="menu__top">
                    <span>Dario Elia</span>
                    <button type="button" className="paren" onClick={() => setOpen(false)}>
                        Chiudi
                    </button>
                </div>
                <nav className="menu__links" aria-label="Menu">
                    {NAV.map((n, i) => (
                        <a key={n.id} href={`/#${n.id}`} onClick={go(n.id)} style={{ ["--i" as string]: i }}>
                            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                            {n.label}
                        </a>
                    ))}
                    <Link href="/cv" onClick={() => setOpen(false)} style={{ ["--i" as string]: NAV.length }}>
                        <span className="mono">{String(NAV.length + 1).padStart(2, "0")}</span>
                        Curriculum
                    </Link>
                </nav>
                <div className="menu__bottom">
                    <button type="button" className="paren" onClick={toggleTheme}>
                        {theme === "dark" ? "Tema chiaro" : "Tema scuro"}
                    </button>
                    <div className="menu__social">
                        {SOCIAL.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="paren">
                                {s.label}
                            </a>
                        ))}
                    </div>
                    {config.available && (
                        <p className="menu__status">
                            <Spark /> {config.availabilityLabel}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
