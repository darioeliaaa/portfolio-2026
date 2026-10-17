"use client";

export type Theme = "light" | "dark";

export const getTheme = (): Theme =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

/** Cambia tema, lo ricorda e avvisa chi disegna (la scena 3D legge i colori dal tema). */
export function setTheme(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
        localStorage.setItem("tema", theme);
    } catch {}
    window.dispatchEvent(new CustomEvent<Theme>("tema", { detail: theme }));
}

export type ToastMessage = { title: string; description?: string };

/** Mostra un messaggio breve in basso a destra. */
export function toast(message: ToastMessage) {
    window.dispatchEvent(new CustomEvent<ToastMessage>("toast", { detail: message }));
}

/** Precompila il modulo contatti (usato dai pacchetti in Tariffe). */
export function prefillContact(planName: string) {
    window.dispatchEvent(new CustomEvent<string>("preventivo", { detail: planName }));
}
