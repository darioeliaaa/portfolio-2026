"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECT_GROUPS, projects, type Project, type ProjectGroup } from "@/data/projects";
import { ScrollTrigger } from "@/lib/scroll";
import SectionTitle from "./section-title";
import ProjectDialog from "./project-dialog";
import CarouselCount from "./carousel-count";

const ORDER = [
    "tripify",
    "moneymind",
    "wavely",
    "bulloneco",
    "ohima",
    "portfolio",
    "ottone",
    "piccantomane",
    "sidero",
    "pelaggi",
    "trediciTattoo",
    "unaNotteDiStelle",
];
const SORTED = [...projects].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
const GROUP_LABEL: Record<ProjectGroup, string> = {
    universitari: "Universitario",
    lavori: "Lavoro",
    dimostrativi: "Dimostrativo",
};

type Filter = "tutti" | ProjectGroup;
type View = "griglia" | "lista";

export default function Projects() {
    const [filter, setFilter] = useState<Filter>("tutti");
    const [view, setView] = useState<View>("griglia");
    const [openId, setOpenId] = useState<string | null>(null);
    const [preview, setPreview] = useState<Project | null>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLUListElement>(null);

    const list = useMemo(() => (filter === "tutti" ? SORTED : SORTED.filter((p) => p.group === filter)), [filter]);
    const note = filter === "tutti" ? null : PROJECT_GROUPS.find((g) => g.id === filter)?.note;

    // dopo un cambio di filtro o di vista le altezze cambiano
    useEffect(() => {
        const id = window.setTimeout(() => ScrollTrigger.refresh(), 60);
        return () => window.clearTimeout(id);
    }, [filter, view]);

    // etichetta "Apri" che segue il puntatore sulle card e anteprima nella vista a lista
    const onMove = (e: React.MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (previewRef.current) previewRef.current.style.transform = `translate3d(${x + 24}px, ${y - 90}px, 0)`;
    };

    const openIndex = openId ? list.findIndex((p) => p.id === openId) : -1;

    return (
        <section id="progetti" className="section projects inv" aria-labelledby="progetti-title" onMouseMove={onMove}>
            <SectionTitle id="progetti-title" outline="Selezionati" solid="Progetti" />

            <div className="projects__bar cols" data-reveal>
                <div className="projects__filter" role="group" aria-label="Filtra i progetti">
                    <span className="muted">Filtro:</span>
                    {(["tutti", ...PROJECT_GROUPS.map((g) => g.id)] as Filter[]).map((f) => {
                        const count = f === "tutti" ? SORTED.length : SORTED.filter((p) => p.group === f).length;
                        const label = f === "tutti" ? "Tutti" : PROJECT_GROUPS.find((g) => g.id === f)!.label;
                        return (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={"projects__chip" + (filter === f ? " is-on" : "")}
                                aria-pressed={filter === f}
                            >
                                <span className={filter === f ? "paren" : undefined}>{label}</span>
                                <sup className="mono">{count}</sup>
                            </button>
                        );
                    })}
                </div>
                <p className="projects__sub muted">Cose che ho progettato, sviluppato e messo online. Clicca su un progetto per i dettagli.</p>
                <div className="projects__view" role="group" aria-label="Vista">
                    <span className="muted">Vista:</span>
                    {(["griglia", "lista"] as View[]).map((v) => (
                        <button key={v} type="button" onClick={() => setView(v)} className={"projects__chip" + (view === v ? " is-on" : "")} aria-pressed={view === v}>
                            <span className={view === v ? "paren" : undefined}>{v === "griglia" ? "Griglia" : "Lista"}</span>
                        </button>
                    ))}
                </div>
            </div>

            {note && (
                <p className="projects__note cols" key={filter}>
                    <span className="mono">{PROJECT_GROUPS.find((g) => g.id === filter)!.label}</span>
                    <span>{note}</span>
                </p>
            )}

            {view === "griglia" ? (
                <>
                    <ul ref={gridRef} className="pgrid" key={`g-${filter}`}>
                        {list.map((p, i) => (
                            <li key={p.id} className={`pgrid__item pgrid__item--${i % 6}`} data-reveal>
                                <button
                                    type="button"
                                    className="pcard"
                                    onClick={() => setOpenId(p.id)}
                                    onMouseEnter={() => cursorRef.current?.classList.add("is-on")}
                                    onMouseLeave={() => cursorRef.current?.classList.remove("is-on")}
                                    aria-label={`${p.title}: apri i dettagli`}
                                >
                                    <span className="pcard__media">
                                        <img src={p.src} alt="" loading="lazy" decoding="async" />
                                    </span>
                                    <span className="pcard__cap">
                                        <span className="pcard__title">
                                            {p.title} <span className="pcard__cat">({p.category})</span>
                                        </span>
                                        <span className="pcard__lead">{p.lead}</span>
                                        <span className="pcard__group mono">{GROUP_LABEL[p.group]}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <CarouselCount key={`c-${filter}`} target={gridRef} total={list.length} />
                </>
            ) : (
                <ol className="plist cols" key={`l-${filter}`}>
                    {list.map((p, i) => (
                        <li key={p.id} data-reveal style={{ ["--d" as string]: `${i * 0.03}s` }}>
                            <button
                                type="button"
                                className="plist__row"
                                onClick={() => setOpenId(p.id)}
                                onMouseEnter={() => setPreview(p)}
                                onMouseLeave={() => setPreview(null)}
                                onFocus={() => setPreview(null)}
                            >
                                <span className="mono plist__n">{String(i + 1).padStart(2, "0")}</span>
                                <span className="plist__title">{p.title}</span>
                                <span className="plist__cat muted">{p.category}</span>
                                <span className="plist__stack muted">{[...p.skills.frontend, ...p.skills.backend].slice(0, 4).join(" · ")}</span>
                                <span className="plist__group mono">{GROUP_LABEL[p.group]}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            )}

            <div ref={cursorRef} className="pcursor" aria-hidden>
                Apri
            </div>
            <div ref={previewRef} className={"ppreview" + (preview ? " is-on" : "")} aria-hidden>
                {preview && <img src={preview.src} alt="" />}
            </div>

            <ProjectDialog
                project={openIndex >= 0 ? list[openIndex] : null}
                index={openIndex}
                total={list.length}
                groupLabel={openIndex >= 0 ? GROUP_LABEL[list[openIndex].group] : ""}
                groupNote={openIndex >= 0 && list[openIndex].group === "dimostrativi" ? PROJECT_GROUPS[2].note : null}
                onClose={() => setOpenId(null)}
                onStep={(d) => {
                    if (openIndex < 0) return;
                    setOpenId(list[(openIndex + d + list.length) % list.length].id);
                }}
            />
        </section>
    );
}
