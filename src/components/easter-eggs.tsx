"use client";

import { useEffect } from "react";
import { config } from "@/data/config";
import { toast } from "@/lib/ui";

const AWAY_TITLES = ["👋 Torna qui!", "Il codice non si scrive da solo... 🥲", "😳 Non te ne andare"];
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Piccole sorprese per chi apre la console, cambia scheda o conosce il Konami code. */
export default function EasterEggs() {
    useEffect(() => {
        const title = [
            "%c",
            "  ██████╗  █████╗ ██████╗ ██╗ ██████╗ ",
            "  ██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗",
            "  ██║  ██║███████║██████╔╝██║██║   ██║",
            "  ██║  ██║██╔══██║██╔══██╗██║██║   ██║",
            "  ██████╔╝██║  ██║██║  ██║██║╚██████╔╝",
            "  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ",
            "",
        ].join("\n");
        console.log(title, "font-family:monospace;font-size:12px;line-height:1.1");
        console.log(`%c${config.role}%c · ${config.location}`, "font-weight:700;font-size:13px", "font-size:13px;opacity:.7");
        console.log("%cCurioso di vedere com'è fatto? Il codice è qui 👇", "font-size:12px;opacity:.7");
        console.log(`   ${config.social.github}`);
        console.log("%cE se stai leggendo questo, probabilmente dovremmo lavorare insieme. 😉", "font-size:12px;opacity:.7");
    }, []);

    useEffect(() => {
        let original = document.title;
        let i = 0;
        const onVisibility = () => {
            if (document.hidden) {
                original = document.title;
                document.title = AWAY_TITLES[i++ % AWAY_TITLES.length];
            } else {
                document.title = original;
            }
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    useEffect(() => {
        let progress = 0;
        const onKey = (e: KeyboardEvent) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
            if (progress === KONAMI.length) {
                progress = 0;
                document.documentElement.classList.add("konami");
                window.setTimeout(() => document.documentElement.classList.remove("konami"), 2400);
                window.dispatchEvent(new Event("quack"));
                toast({ title: "Konami Code! 🎮", description: "Ok, sei ufficialmente un vero developer. Rispetto." });
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return null;
}
