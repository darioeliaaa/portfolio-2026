"use client";

import { useRef } from "react";
import { pricingPlans } from "@/data/pricing-plans";
import CarouselCount from "./carousel-count";
import { scrollToId } from "@/lib/scroll";
import { prefillContact } from "@/lib/ui";
import SectionTitle from "./section-title";

const MAINTENANCE = ["Rinnovo dominio", "Frontend (Vercel)", "Backend (Render)*", "Database (Neon)*"];

export default function Pricing() {
    const plansRef = useRef<HTMLOListElement>(null);
    const ask = (plan: string) => {
        prefillContact(plan);
        scrollToId("contatti");
    };

    return (
        <section id="tariffe" className="section pricing" aria-labelledby="tariffe-title">
            <SectionTitle id="tariffe-title" outline="Tariffe" solid="Servizi e prezzi" />
            <div className="cols pricing__intro" data-reveal>
                <p className="label">Listino</p>
                <p className="pricing__lead">
                    Prezzi di partenza trasparenti. Ogni preventivo finale dipende da funzionalità, contenuti e tempi — ne
                    parliamo insieme, senza sorprese.
                </p>
            </div>

            <ol ref={plansRef} className="plans">
                {pricingPlans.map((p, i) => (
                    <li key={p.name} className="plan cols" data-reveal>
                        <div className="plan__name">
                            <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                            <h3>{p.name}</h3>
                            {p.isPopular && <span className="plan__tag mono">Più richiesto</span>}
                        </div>
                        <div className="plan__what">
                            <p>{p.description}</p>
                            <ul>
                                {p.features.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="plan__price">
                            <p>
                                <span className="muted">da</span> <strong>{p.price}</strong>
                            </p>
                            <button type="button" className="paren link-u" onClick={() => ask(p.name)}>
                                Richiedi un preventivo
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
            <CarouselCount target={plansRef} total={pricingPlans.length} />

            <div className="care cols" data-reveal>
                <div className="care__name">
                    <span className="mono muted">Opzionale</span>
                    <h3>Manutenzione &amp; Hosting</h3>
                </div>
                <div className="care__what">
                    <p>
                        Sei libero di gestire l&apos;infrastruttura del tuo sito in totale autonomia. Se invece non vuoi
                        preoccuparti di rinnovi, server e configurazioni, me ne occupo interamente io: il pacchetto copre
                        tutte le spese di mantenimento.
                    </p>
                    <ul>
                        {MAINTENANCE.map((m) => (
                            <li key={m}>{m}</li>
                        ))}
                    </ul>
                    <p className="care__foot muted">
                        *Backend e Database sono inclusi e configurati solo per i progetti che ne richiedono l&apos;utilizzo
                        (es. E-Commerce o Web App).
                    </p>
                </div>
                <div className="plan__price">
                    <p className="mono muted">Tutto incluso</p>
                    <p>
                        <strong>50€</strong>
                        <span className="muted">/mese</span>
                    </p>
                    <p className="muted care__nohidden">Nessun costo nascosto</p>
                    <button type="button" className="paren link-u" onClick={() => ask("Manutenzione & Hosting")}>
                        Parliamone
                    </button>
                </div>
            </div>
        </section>
    );
}
