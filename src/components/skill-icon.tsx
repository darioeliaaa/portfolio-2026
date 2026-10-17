import type { SkillNames } from "@/data/skill-keys";
import { KEY_ICONS } from "./key-icons";

/** Icona monocromatica di una tecnologia (eredita il colore del testo). */
export function SkillIcon({ id, className }: { id: SkillNames; className?: string }) {
    const spec = KEY_ICONS[id];
    if (spec.kind === "text") {
        const fontSize = Math.min(76 / (spec.text.length * 0.68), 56) * (spec.scale ?? 1);
        return (
            <svg viewBox="0 0 100 100" className={className} fill="currentColor" overflow="visible" aria-hidden focusable="false">
                <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-sans)"
                    fontWeight={700}
                    fontSize={fontSize}
                >
                    {spec.text}
                </text>
            </svg>
        );
    }
    return (
        <svg viewBox={spec.viewBox} className={className} fill="currentColor" overflow="visible" aria-hidden focusable="false">
            {spec.paths.map((p, i) => (
                <path key={i} d={p.d} fillOpacity={p.opacity} fillRule={p.fillRule} />
            ))}
        </svg>
    );
}
