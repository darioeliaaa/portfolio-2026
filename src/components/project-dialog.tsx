"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { galleries, type GalleryShot, type GalleryView } from "@/data/galleries";
import { lockScroll } from "@/lib/scroll";

function Gallery({ id, title }: { id: string; title: string }) {
    const g = galleries[id];
    const views = g ? (Object.keys(g.views) as GalleryView[]).filter((v) => g.views[v]?.length) : [];
    const [view, setView] = useState<GalleryView>(views[0] ?? "desktop");
    const [zoom, setZoom] = useState<number | null>(null);
    const railRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setView(views[0] ?? "desktop");
        setZoom(null);
        railRef.current?.scrollTo({ left: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (zoom === null) return;
        const onKey = (e: KeyboardEvent) => {
            const shots = g?.views[view] ?? [];
            if (e.key === "ArrowRight") setZoom((z) => (z === null ? z : (z + 1) % shots.length));
            if (e.key === "ArrowLeft") setZoom((z) => (z === null ? z : (z - 1 + shots.length) % shots.length));
            if (e.key === "Escape") {
                e.stopPropagation();
                setZoom(null);
            }
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [zoom, g, view]);

    if (!g || !views.length) return null;
    const shots = g.views[view] ?? [];
    const frameLabel = g.kind === "web" ? g.host : g.title ?? title;

    const scrollBy = (d: number) => railRef.current?.scrollBy({ left: d * railRef.current.clientWidth * 0.8, behavior: "smooth" });

    return (
        <div className="gallery">
            <div className="gallery__bar">
                <p className="mono">
                    {shots.length} schermate · {view === "desktop" ? "desktop" : "telefono"}
                </p>
                <div className="gallery__tools">
                    {views.length > 1 &&
                        views.map((v) => (
                            <button key={v} type="button" onClick={() => setView(v)} className={view === v ? "paren" : "muted"} aria-pressed={view === v}>
                                {v === "desktop" ? "Desktop" : "Telefono"}
                            </button>
                        ))}
                    <button type="button" onClick={() => scrollBy(-1)} aria-label="Schermate precedenti">
                        ←
                    </button>
                    <button type="button" onClick={() => scrollBy(1)} aria-label="Schermate successive">
                        →
                    </button>
                </div>
            </div>
            <div className={"gallery__rail gallery__rail--" + view} ref={railRef} tabIndex={0} aria-label="Schermate del progetto">
                {shots.map((s: GalleryShot, i) => (
                    <figure key={s.full} className="shot">
                        <button type="button" className={"shot__frame shot__frame--" + (view === "mobile" ? "phone" : g.kind)} onClick={() => setZoom(i)}>
                            {view !== "mobile" && (
                                <span className="shot__chrome" aria-hidden>
                                    <i />
                                    <i />
                                    <i />
                                    <span className="shot__url">
                                        {frameLabel}
                                        {g.kind === "web" && s.path ? s.path : ""}
                                    </span>
                                </span>
                            )}
                            <img src={s.rail} alt={s.label} width={s.railW} height={Math.round((s.h / s.w) * s.railW)} loading="lazy" decoding="async" />
                        </button>
                        <figcaption>
                            <span className="mono">{String(i + 1).padStart(2, "0")}</span> {s.label}
                        </figcaption>
                    </figure>
                ))}
            </div>

            {zoom !== null && shots[zoom] && (
                <div className="lightbox" role="dialog" aria-modal="true" aria-label={shots[zoom].label} onClick={() => setZoom(null)}>
                    <img src={shots[zoom].full} alt={shots[zoom].label} onClick={(e) => e.stopPropagation()} />
                    <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setZoom((z) => (z! - 1 + shots.length) % shots.length)}>
                            ← Precedente
                        </button>
                        <span>
                            {zoom + 1} / {shots.length} · {shots[zoom].label}
                        </span>
                        <button type="button" onClick={() => setZoom((z) => (z! + 1) % shots.length)}>
                            Successiva →
                        </button>
                        <button type="button" className="paren" onClick={() => setZoom(null)}>
                            Chiudi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProjectDialog({
    project,
    index,
    total,
    groupLabel,
    groupNote,
    onClose,
    onStep,
}: {
    project: Project | null;
    index: number;
    total: number;
    groupLabel: string;
    groupNote: string | null;
    onClose: () => void;
    onStep: (d: number) => void;
}) {
    const open = project !== null;
    const panelRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const returnFocus = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;
        returnFocus.current = document.activeElement as HTMLElement;
        lockScroll(true);
        closeRef.current?.focus({ preventScroll: true });
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab" && panelRef.current) {
                const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']");
                if (!f.length) return;
                const first = f[0];
                const last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            lockScroll(false);
            returnFocus.current?.focus({ preventScroll: true });
        };
    }, [open, onClose]);

    useEffect(() => {
        panelRef.current?.scrollTo({ top: 0 });
    }, [project?.id]);

    const hasLive = project && project.live && project.live !== "#";

    return (
        <div className={"pdialog" + (open ? " is-open" : "")} aria-hidden={!open} inert={!open} onClick={onClose}>
            <div
                ref={panelRef}
                className="pdialog__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pdialog-title"
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent
            >
                {project && (
                    <>
                        <div className="pdialog__top">
                            <button ref={closeRef} type="button" className="paren" onClick={onClose}>
                                Chiudi
                            </button>
                            <span className="mono">
                                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                            </span>
                            <span className="pdialog__steps">
                                <button type="button" className="paren" onClick={() => onStep(-1)}>
                                    Precedente
                                </button>
                                <button type="button" className="paren" onClick={() => onStep(1)}>
                                    Successivo
                                </button>
                            </span>
                        </div>

                        <header className="pdialog__head">
                            <p className="mono pdialog__group">
                                {groupLabel} · {project.category}
                            </p>
                            <h3 id="pdialog-title" className="pdialog__title">
                                {project.title}
                            </h3>
                            <p className="pdialog__lead">{project.lead}</p>
                            <div className="pdialog__links">
                                {hasLive && (
                                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
                                        Visita il sito ↗
                                    </a>
                                )}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn">
                                        Codice ↗
                                    </a>
                                )}
                            </div>
                        </header>

                        <Gallery id={project.id} title={project.title} />

                        <div className="pdialog__body">
                            <aside className="pdialog__stack">
                                {project.skills.frontend.length > 0 && (
                                    <div>
                                        <p className="mono muted">Frontend</p>
                                        <ul>
                                            {project.skills.frontend.map((s) => (
                                                <li key={s}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {project.skills.backend.length > 0 && (
                                    <div>
                                        <p className="mono muted">Backend</p>
                                        <ul>
                                            {project.skills.backend.map((s) => (
                                                <li key={s}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {groupNote && <p className="pdialog__note">{groupNote}</p>}
                            </aside>
                            <div className="pdialog__content">{project.content}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
