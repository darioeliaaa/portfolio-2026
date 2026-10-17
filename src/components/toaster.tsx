"use client";

import { useEffect, useRef, useState } from "react";
import type { ToastMessage } from "@/lib/ui";

type Item = ToastMessage & { id: number };

export default function Toaster() {
    const [items, setItems] = useState<Item[]>([]);
    const next = useRef(0);

    useEffect(() => {
        const onToast = (e: Event) => {
            const detail = (e as CustomEvent<ToastMessage>).detail;
            const id = ++next.current;
            setItems((list) => [...list.slice(-2), { ...detail, id }]);
            window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 4600);
        };
        window.addEventListener("toast", onToast);
        return () => window.removeEventListener("toast", onToast);
    }, []);

    return (
        <div className="toaster" role="status" aria-live="polite">
            {items.map((t) => (
                <div key={t.id} className="toast">
                    <p className="toast__title">{t.title}</p>
                    {t.description && <p className="toast__desc">{t.description}</p>}
                </div>
            ))}
        </div>
    );
}
