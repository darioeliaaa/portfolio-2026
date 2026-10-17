"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { planByName, subjectForPlan } from "@/data/pricing-plans";
import { toast } from "@/lib/ui";

/** Il messaggio parte dal sito: POST alla rotta interna, che invia l'email lato server. */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() || "/api/contact";

const SUBJECTS = [
    "Sito vetrina / Landing page",
    "E-commerce",
    "Web app / Portale su misura",
    "App mobile",
    "Manutenzione o restyling",
    "Proposta di lavoro",
    "Altro",
] as const;

const schema = z.object({
    fullName: z.string().min(2, "Il nome completo deve contenere almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    subject: z.string().min(1, "Seleziona di cosa hai bisogno"),
    message: z.string().min(10, "Il messaggio deve contenere almeno 10 caratteri"),
});
type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export default function ContactForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState<string>(SUBJECTS[0]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [sendError, setSendError] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const honeypot = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const applyPlan = useCallback((planName: string) => {
        if (planName === "Manutenzione & Hosting") {
            setSubject("Manutenzione o restyling");
            setMessage("Mi interessa il pacchetto Manutenzione & Hosting (50€/mese).\n\n");
        } else {
            const plan = planByName(planName);
            if (!plan) return;
            setSubject(subjectForPlan(plan.name));
            setMessage(`Vorrei un preventivo per: ${plan.name} (da ${plan.price}).\n\n`);
        }
        setSent(false);
        window.setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 1500);
    }, []);

    // dai bottoni di Tariffe, e da un link condiviso con ?piano=...
    useEffect(() => {
        const onPlan = (e: Event) => applyPlan((e as CustomEvent<string>).detail);
        window.addEventListener("preventivo", onPlan);
        const fromUrl = new URLSearchParams(window.location.search).get("piano");
        if (fromUrl) applyPlan(fromUrl);
        return () => window.removeEventListener("preventivo", onPlan);
    }, [applyPlan]);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setSendError("");
        if (honeypot.current?.value) {
            setSent(true);
            return;
        }
        const result = schema.safeParse({ fullName, email, subject, message });
        if (!result.success) {
            const next: Errors = {};
            result.error.issues.forEach((issue) => {
                const k = issue.path[0] as keyof Errors;
                if (!next[k]) next[k] = issue.message;
            });
            setErrors(next);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ name: fullName, email, subject, message, company: honeypot.current?.value ?? "" }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Non sono riuscito a inviare il messaggio. Riprova tra poco.");
            toast({ title: "Messaggio inviato 🎉", description: "Grazie! Ti rispondo il prima possibile." });
            setSent(true);
            setFullName("");
            setEmail("");
            setSubject(SUBJECTS[0]);
            setMessage("");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Non sono riuscito a inviare il messaggio. Riprova tra poco.";
            setSendError(msg);
            toast({ title: "Invio non riuscito", description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="cform" onSubmit={submit} noValidate>
            <span className="cform__mark cform__mark--tl" aria-hidden>+</span>
            <span className="cform__mark cform__mark--tr" aria-hidden>+</span>
            <span className="cform__mark cform__mark--bl" aria-hidden>+</span>
            <span className="cform__mark cform__mark--br" aria-hidden>+</span>

            <p className="cform__title">Scrivimi due righe</p>
            <p className="cform__hint muted">Più dettagli mi dai, più preciso sarà il preventivo.</p>

            <div className="cform__hp" aria-hidden>
                <label htmlFor="company-website">Non compilare questo campo</label>
                <input ref={honeypot} id="company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="cform__row">
                <label htmlFor="cf-name">Nome completo</label>
                <input
                    id="cf-name"
                    name="name"
                    placeholder="Il tuo nome"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors((p) => ({ ...p, fullName: undefined }));
                    }}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "err-name" : undefined}
                />
                {errors.fullName && <p id="err-name" className="cform__err">{errors.fullName}</p>}
            </div>
            <div className="cform__row">
                <label htmlFor="cf-email">Indirizzo email</label>
                <input
                    id="cf-email"
                    name="email"
                    type="email"
                    placeholder="tu@esempio.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "err-email" : undefined}
                />
                {errors.email && <p id="err-email" className="cform__err">{errors.email}</p>}
            </div>
            <div className="cform__row">
                <label htmlFor="cf-subject">Di cosa hai bisogno?</label>
                <select id="cf-subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>
            <div className="cform__row">
                <label htmlFor="cf-message">Il tuo messaggio</label>
                <div className="cform__msg">
                    <textarea
                        ref={messageRef}
                        id="cf-message"
                        name="message"
                        rows={5}
                        placeholder="Parlami del tuo progetto: obiettivi, tempi e budget indicativo…"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            setErrors((p) => ({ ...p, message: undefined }));
                        }}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "err-message" : "hint-message"}
                    />
                    <button type="submit" className="cform__send" disabled={loading}>
                        {loading ? "Invio…" : <span className="paren">Invia messaggio</span>}
                    </button>
                </div>
                {errors.message && <p id="err-message" className="cform__err">{errors.message}</p>}
                <p id="hint-message" className="cform__privacy muted">
                    Non condividerò mai i tuoi dati con nessun altro. Promesso.
                </p>
            </div>
            {sendError && (
                <p role="alert" className="cform__alert">
                    {sendError}
                </p>
            )}
            {sent && !sendError && (
                <p role="status" className="cform__ok">
                    Messaggio inviato. Grazie! Ti rispondo il prima possibile.
                </p>
            )}
        </form>
    );
}
