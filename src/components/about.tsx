"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { config } from "@/data/config";
import { EXPERIENCE, SKILLS } from "@/data/constants";
import { projects } from "@/data/projects";
import { gsap, ScrollTrigger } from "@/lib/scroll";

const FOCUS = [
    {
        title: "Frontend",
        desc: "Interfacce reattive con Angular, React e Next.js. Attenzione maniacale a dettagli, accessibilità e micro-interazioni.",
    },
    {
        title: "Backend",
        desc: "API REST solide in Java e Spring Boot, database relazionali progettati per reggere davvero il carico.",
    },
    {
        title: "Web 3D & Motion",
        desc: "Scene interattive, animazioni scroll-driven e quel tocco in più che fa ricordare un sito.",
    },
];

/** La presentazione divisa in due paragrafi, come nel portfolio precedente. */
const BIO = config.description.long.split(". ").reduce<string[]>((acc, sentence, i) => {
    const idx = i < 2 ? 0 : 1;
    acc[idx] = (acc[idx] ? acc[idx] + " " : "") + sentence.replace(/\.?$/, ".");
    return acc;
}, []);

const STATS = [
    { value: 23, label: "anni" },
    { value: projects.length, label: "progetti" },
    { value: Object.keys(SKILLS).length, label: "tecnologie" },
    { value: 2023, label: "dal", plain: true },
];

function Counter({ value, plain }: { value: number; plain?: boolean }) {
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const el = ref.current!;
        if (plain) return;
        const state = { v: 0 };
        const st = ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
                gsap.to(state, {
                    v: value,
                    duration: 1.4,
                    ease: "power3.out",
                    onUpdate: () => {
                        el.textContent = String(Math.round(state.v));
                    },
                }),
        });
        return () => st.kill();
    }, [value, plain]);
    return (
        <span ref={ref} className="about__stat-n">
            {value}
        </span>
    );
}

export default function About() {
    const monogram = config.author
        .split(" ")
        .map((w) => w[0])
        .join("");

    return (
        <section id="chi-sono" className="section about" aria-labelledby="about-title">
            <div className="about__hero">
                <h2 id="about-title" className="about__word outline-word" data-reveal>
                    Chi sono
                </h2>
                <div className="about__intro cols">
                    <figure className="about__photo" data-reveal>
                        <span className="objtag mono">dario.jpg</span>
                        {config.avatar ? (
                            <img src={config.avatar} alt={config.author} width={1000} height={1250} loading="lazy" decoding="async" />
                        ) : (
                            <span className="about__mono" aria-hidden>
                                {monogram}
                            </span>
                        )}
                        <figcaption className="mono">Unical · DEMACS</figcaption>
                    </figure>
                    <div className="about__text" data-reveal style={{ ["--d" as string]: "0.1s" }}>
                        <p className="about__kicker mono">Dietro al codice</p>
                        <p className="about__lede">Uno studente di Informatica che tratta ogni progetto come se fosse il proprio.</p>
                        {BIO.map((p, i) => (
                            <p key={i} className="about__p">
                                {p}
                            </p>
                        ))}
                        <Link href="/cv" className="about__cv paren link-u">
                            Curriculum completo ↗
                        </Link>
                    </div>
                </div>
            </div>

            <dl className="about__stats cols" data-reveal>
                {STATS.map((s) => (
                    <div key={s.label} className="about__stat">
                        <dt className="mono muted">{s.label}</dt>
                        <dd>
                            <Counter value={s.value} plain={s.plain} />
                        </dd>
                    </div>
                ))}
            </dl>

            <ul className="about__focus cols">
                {FOCUS.map((f, i) => (
                    <li key={f.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                        <p className="mono muted">(0{i + 1})</p>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </li>
                ))}
            </ul>

            <div className="path" aria-labelledby="path-title">
                <div className="path__head cols" data-reveal>
                    <p className="mono">Percorso</p>
                    <h3 id="path-title" className="path__title">
                        Formazione <em>&amp;</em> Esperienza
                    </h3>
                    <p className="path__sub muted">Dove ho studiato, cosa ho costruito e cosa mi ha portato fin qui.</p>
                </div>
                <ol className="path__list">
                    {EXPERIENCE.map((e) => (
                        <li key={e.id} className="path__item cols" data-reveal>
                            <div className="path__when">
                                <p className="mono">
                                    {e.startDate} — {e.endDate}
                                </p>
                                <p className="path__kind">
                                    {e.current && <span className="path__dot" aria-label="in corso" />}
                                    {e.kind === "education" ? "Formazione" : "Esperienza"}
                                </p>
                            </div>
                            <div className="path__what">
                                <h4>{e.title}</h4>
                                <p className="path__org muted">{e.company}</p>
                                <ul className="path__desc">
                                    {e.description.map((d, i) => (
                                        <li key={i}>{d}</li>
                                    ))}
                                </ul>
                                {e.skills.length > 0 && (
                                    <p className="path__skills mono">{e.skills.map((s) => SKILLS[s].label).join(" · ")}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
