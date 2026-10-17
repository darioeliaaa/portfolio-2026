import { config } from "@/data/config";
import ContactForm from "./contact-form";
import CompassObject from "./compass-object";

const SOCIAL = [
    { href: config.social.github, label: "GitHub", handle: "@darioeliaaa" },
    { href: config.social.linkedin, label: "LinkedIn", handle: "Dario Elia" },
    { href: config.social.instagram, label: "Instagram", handle: "@darioeliaaa" },
];

export default function Contact() {
    return (
        <section id="contatti" className="section contact" aria-labelledby="contatti-title">
            <h2 id="contatti-title" className="sr-only">
                Contatti — Lavoriamo insieme
            </h2>
            <div className="contact__grid cols">
                <div className="contact__obj" data-reveal>
                    <CompassObject />
                </div>
                <div className="contact__say" data-reveal style={{ ["--d" as string]: "0.08s" }}>
                    <p className="contact__line">
                        Se sei arrivato fin qui,
                        <br />
                        forse è il caso di parlarne.
                    </p>
                    <p className="contact__kicker mono">Lavoriamo insieme</p>
                    <p className="contact__text muted">
                        Hai un&apos;idea, un progetto o semplicemente una domanda? Scrivimi: rispondo di solito entro 24 ore.
                    </p>
                    {config.email && (
                        <a href={`mailto:${config.email}`} className="u-line contact__mail">
                            {config.email}
                        </a>
                    )}
                    <dl className="contact__facts">
                        <div>
                            <dt className="muted">Dove</dt>
                            <dd>{config.location}</dd>
                        </div>
                        <div>
                            <dt className="muted">Risposta</dt>
                            <dd>entro 24h</dd>
                        </div>
                        <div>
                            <dt className="muted">Stato</dt>
                            <dd>{config.available ? "Disponibile" : "Al completo"}</dd>
                        </div>
                    </dl>
                </div>
                <div className="contact__form" data-reveal style={{ ["--d" as string]: "0.16s" }}>
                    <ContactForm />
                    {config.calendly && (
                        <div className="contact__call">
                            <p className="label">Preferisci parlarne a voce?</p>
                            <a href={config.calendly} target="_blank" rel="noopener noreferrer" className="contact__book">
                                <span className="paren">Prenota una call conoscitiva di 30 minuti, gratis</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <p className="contact__word outline-word" aria-hidden>
                Parliamone
            </p>

            <div className="contact__social cols">
                <p className="label">Preferisci un altro canale?</p>
                <ul>
                    {SOCIAL.map((s) => (
                        <li key={s.label}>
                            <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-u">
                                <span className="paren">{s.label}</span> <span className="muted">{s.handle}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
