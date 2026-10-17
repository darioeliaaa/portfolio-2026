"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { config } from "@/data/config";
import { lockScroll, prefersReducedMotion, scrollToId, ScrollTrigger } from "@/lib/scroll";
import { getTheme } from "@/lib/ui";
import type { Workstation } from "@/three/workstation";
import HeroLogo from "./hero-logo";

const BLURB = config.description.short;

const SOCIAL = [
    { href: config.social.github, label: "GitHub" },
    { href: config.social.linkedin, label: "LinkedIn" },
    { href: config.social.instagram, label: "Instagram" },
];

/** Ruoli che si scrivono uno dopo l'altro, come in un terminale. */
function RoleTyper() {
    const [text, setText] = useState(config.roles[0]);
    useEffect(() => {
        if (prefersReducedMotion()) return;
        let role = 0;
        let i = config.roles[0].length;
        let deleting = true;
        let timer = 0;
        const step = () => {
            const full = config.roles[role];
            if (deleting) {
                i--;
                if (i <= 0) {
                    deleting = false;
                    role = (role + 1) % config.roles.length;
                }
            } else {
                i++;
            }
            setText(config.roles[role].slice(0, Math.max(0, i)));
            let delay = deleting ? 28 : 55;
            if (!deleting && i >= config.roles[role].length) {
                deleting = true;
                delay = 2400;
            }
            void full;
            timer = window.setTimeout(step, delay);
        };
        timer = window.setTimeout(step, 2600);
        return () => window.clearTimeout(timer);
    }, []);
    return (
        <p className="hero__role mono" aria-label={config.roles.join(", ")}>
            <span aria-hidden>
                <span className="hero__prompt">&gt;</span> {text}
                <span className="hero__caret" />
            </span>
        </p>
    );
}

export default function Stage() {
    const stageRef = useRef<HTMLElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const blurbRef = useRef<HTMLParagraphElement>(null);
    const slotRef = useRef<HTMLDivElement>(null);
    const objRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const stage = stageRef.current!;
        const sticky = stickyRef.current!;
        const canvas = canvasRef.current!;
        const root = document.documentElement;
        const words = Array.from(blurbRef.current!.querySelectorAll<HTMLElement>(".w"));
        const mobile = window.matchMedia("(max-width: 760px)").matches;
        const reduced = prefersReducedMotion();
        let seen = false;
        try {
            seen = sessionStorage.getItem("intro-vista") === "1";
        } catch {}
        const playIntro = !reduced && !seen;

        let ws: Workstation | null = null;
        let disposed = false;
        let progress = 0;
        let introRunning = playIntro;
        let visible = true;
        let introDone = !playIntro;

        const updateLoop = () => {
            if (!ws) return;
            if (visible && (introRunning || progress >= 0.1)) ws.start();
            else ws.stop();
        };

        const finishIntro = () => {
            if (introDone) return;
            introDone = true;
            introRunning = false;
            stage.classList.remove("is-dark");
            root.classList.remove("is-intro");
            lockScroll(false);
            try {
                sessionStorage.setItem("intro-vista", "1");
            } catch {}
            ws?.setIntro(1);
            updateLoop();
        };

        if (playIntro) {
            stage.classList.add("is-dark");
            root.classList.add("is-intro");
            lockScroll(true);
            window.scrollTo(0, 0);
        }
        // se la scena non arriva in tempo, il sito non resta al buio
        const safety = window.setTimeout(finishIntro, 6500);

        // scroll → costruzione della postazione e frase finale
        const st = ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                progress = self.progress;
                ws?.setProgress(progress);
                const fade = Math.min(1, Math.max(0, (progress - 0.62) / 0.2));
                if (fadeRef.current) fadeRef.current.style.opacity = String(fade);
                // l'etichetta del modello compare quando la prima schermata se n'è andata
                if (objRef.current) objRef.current.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.12) / 0.06)));
                if (blurbRef.current) blurbRef.current.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.72) / 0.08)));
                const wp = Math.min(1, Math.max(0, (progress - 0.75) / 0.2));
                words.forEach((w, i) => {
                    const local = Math.min(1, Math.max(0, wp * words.length - i));
                    w.style.opacity = String(0.14 + 0.86 * local);
                });
                updateLoop();
            },
        });

        // il riquadro libero della prima schermata, in frazioni della finestra
        const measure = () => {
            const slot = slotRef.current;
            if (!ws || !slot) return;
            const r = slot.getBoundingClientRect();
            const W = sticky.clientWidth || 1;
            const H = sticky.clientHeight || 1;
            // come se la pagina fosse in cima, e solo la parte che si vede davvero (schermi molto bassi)
            const top = Math.max(0, r.top - stage.getBoundingClientRect().top);
            const bottom = Math.min(H, r.bottom - stage.getBoundingClientRect().top);
            const h = Math.max(H * 0.18, bottom - top);
            const cy = Math.min(1 - h / H / 2, (top + bottom) / 2 / H);
            ws.setHeroFrame({ cx: (r.left + r.width / 2) / W, cy, w: r.width / W, h: h / H });
        };
        const ro = new ResizeObserver(() => {
            ws?.setSize(sticky.clientWidth, sticky.clientHeight);
            measure();
        });
        ro.observe(sticky);
        if (slotRef.current) ro.observe(slotRef.current);
        document.fonts?.ready.then(measure);

        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            updateLoop();
        });
        io.observe(stage);

        const onTheme = (e: Event) => ws?.setTheme((e as CustomEvent<"light" | "dark">).detail);
        const onQuack = () => {
            ws?.quack();
            ws?.start();
            window.setTimeout(updateLoop, 1400);
        };
        window.addEventListener("tema", onTheme);
        window.addEventListener("quack", onQuack);

        (async () => {
            try {
                const css = getComputedStyle(root);
                const fonts = {
                    serif: css.getPropertyValue("--font-instrument").trim() || "Georgia, serif",
                    mono: css.getPropertyValue("--font-jetbrains").trim() || "Menlo, monospace",
                    sans: css.getPropertyValue("--font-inter").trim() || "Arial, sans-serif",
                };
                await Promise.all([
                    document.fonts.load(`italic 300px ${fonts.serif}`),
                    document.fonts.load(`400 30px ${fonts.mono}`),
                    document.fonts.load(`600 22px ${fonts.sans}`),
                ]).catch(() => undefined);
                const { Workstation } = await import("@/three/workstation");
                if (disposed) return;
                ws = new Workstation(canvas, { fonts, theme: getTheme(), mobile });
                if (process.env.NODE_ENV !== "production") (window as unknown as { __postazione?: Workstation }).__postazione = ws;
                ws.setSize(sticky.clientWidth, sticky.clientHeight);
                measure();
                ws.setProgress(progress);
                stage.classList.add("is-ready");

                if (playIntro && !introDone) {
                    window.clearTimeout(safety);
                    // L'intro avanza a passi di massimo 50 ms: se la pagina si blocca un attimo
                    // (la prima compilazione della scena), riprende da dove era invece di saltare.
                    const DURATION = 3.6;
                    let t = 0;
                    let last = 0;
                    let lit = false;
                    let shown = false;
                    let warm = 3; // qualche frame per compilare la scena prima di partire
                    const step = (now: number) => {
                        if (disposed || introDone) return;
                        if (warm > 0) {
                            warm--;
                            last = now;
                            ws?.setIntro(0);
                            requestAnimationFrame(step);
                            return;
                        }
                        t += Math.min(0.05, (now - last) / 1000) / DURATION;
                        last = now;
                        ws?.setIntro(Math.min(1, t));
                        if (!lit && t > 0.42) {
                            lit = true;
                            stage.classList.remove("is-dark");
                        }
                        if (!shown && t > 0.62) {
                            shown = true;
                            root.classList.remove("is-intro");
                        }
                        if (t >= 1) finishIntro();
                        else requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                    updateLoop();
                } else {
                    ws.setIntro(1);
                    finishIntro();
                }
            } catch (err) {
                console.warn("Scena 3D non disponibile:", err);
                finishIntro();
            }
        })();

        return () => {
            disposed = true;
            window.clearTimeout(safety);
            st.kill();
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("tema", onTheme);
            window.removeEventListener("quack", onQuack);
            if (!introDone) {
                root.classList.remove("is-intro");
                lockScroll(false);
            }
            ws?.dispose();
        };
    }, []);

    const go = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToId(id);
    };

    return (
        <section id="top" ref={stageRef} className="stage section" aria-label="Presentazione">
            <div ref={stickyRef} className="stage__sticky">
                <canvas ref={canvasRef} className="stage__canvas" aria-hidden />
                <div ref={fadeRef} className="stage__fade" aria-hidden />
                <p ref={blurbRef} className="stage__blurb">
                    {BLURB.split(" ").map((w, i) => (
                        <span key={i} className="w">
                            {w}{" "}
                        </span>
                    ))}
                </p>
                <span ref={objRef} className="stage__obj mono" aria-hidden>
                    macbook-air-m4.obj · midnight
                </span>
            </div>

            <div className="hero">
                <HeroLogo />
                <ul className="hero__plus cols" aria-label="Cosa faccio">
                    <li style={{ ["--d" as string]: "0.1s" }}>+Full-Stack Developer</li>
                    <li style={{ ["--d" as string]: "0.18s" }}>+Web &amp; App Mobile</li>
                    <li style={{ ["--d" as string]: "0.26s" }}>+Backend &amp; Web 3D</li>
                </ul>

                <div className="hero__main cols">
                    <div className="hero__side hero__side--left">
                        <p className="hero__hello">Ciao, sono {config.author}.</p>
                        <p className="hero__study">Studente di Informatica @ Unical</p>
                        <RoleTyper />
                    </div>
                    {/* spazio libero per il MacBook: la scena 3D lo misura e ci mette dentro il portatile */}
                    <div ref={slotRef} className="hero__slot" aria-hidden />
                    <div className="hero__side hero__side--right">
                        <p className="hero__tagline">{config.tagline}</p>
                        <div className="hero__cta">
                            <a href="#contatti" onClick={go("contatti")} className="btn btn--solid">
                                Lavoriamo insieme
                            </a>
                            <a href="#progetti" onClick={go("progetti")} className="btn">
                                Guarda i progetti <span aria-hidden>↓</span>
                            </a>
                            <Link href="/cv" className="btn btn--ghost">
                                CV
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="hero__foot">
                    <div className="hero__social">
                        {SOCIAL.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="paren link-u">
                                {s.label}
                            </a>
                        ))}
                    </div>
                    <span className="hero__scroll mono" aria-hidden>
                        Scorri · si costruisce la postazione
                    </span>
                    <span className="hero__where">{config.location}</span>
                </div>
            </div>
        </section>
    );
}
