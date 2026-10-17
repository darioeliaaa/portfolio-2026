"use client";

import { useState } from "react";
import { SKILLS, type Skill } from "@/data/constants";
import { SKILL_CATEGORIES, SKILL_KEYS, type SkillCategory, type SkillNames } from "@/data/skill-keys";
import SectionTitle from "./section-title";
import { SkillIcon } from "./skill-icon";

const ORDER = Object.keys(SKILL_CATEGORIES) as SkillCategory[];
const BY_CATEGORY = ORDER.map((cat) => ({
    cat,
    label: SKILL_CATEGORIES[cat].label,
    skills: SKILL_KEYS.filter((k) => k.category === cat).map((k) => SKILLS[k.id]),
}));

function Row({ index, label, skills }: { index: number; label: string; skills: Skill[] }) {
    const [active, setActive] = useState<Skill | null>(null);
    const descId = `skill-desc-${index}`;
    return (
        <div className="skills__row cols" data-reveal>
            <div className="skills__head">
                <p className="skills__cat">
                    <span className="mono skills__num">({String(index + 1).padStart(2, "0")})</span>
                    <span className="skills__cat-name">{label}</span>
                </p>
                <p className="skills__count mono">
                    {skills.length} {skills.length === 1 ? "tecnologia" : "tecnologie"}
                </p>
                <div className="skills__desc" id={descId} aria-live="polite">
                    {active ? (
                        <>
                            <span className="skills__desc-name">{active.label}</span>
                            <span>{active.shortDescription}</span>
                        </>
                    ) : (
                        <span className="muted">Passaci sopra (o toccala) per sapere dove l&apos;ho usata.</span>
                    )}
                </div>
            </div>
            <ul className="skills__list" onMouseLeave={() => setActive(null)}>
                {skills.map((s) => (
                    <li key={s.name}>
                        <button
                            type="button"
                            className={"skill" + (active?.name === s.name ? " is-active" : "")}
                            onMouseEnter={() => setActive(s)}
                            onFocus={() => setActive(s)}
                            onClick={() => setActive((cur) => (cur?.name === s.name ? null : s))}
                            aria-describedby={descId}
                            aria-pressed={active?.name === s.name}
                        >
                            <SkillIcon id={s.name as SkillNames} className="skill__icon" />
                            <span>{s.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Skills() {
    const total = Object.keys(SKILLS).length;
    return (
        <section id="skills" className="section skills" aria-labelledby="skills-title">
            <SectionTitle id="skills-title" outline="Competenze" solid="Skills" />
            <div className="cols skills__intro" data-reveal>
                <p className="label">Stack</p>
                <p className="skills__lead">
                    {`${total} tecnologie, divise come nel mio curriculum. Accanto a ognuna c'è dove l'ho usata davvero — e quando viene da un corso o dalla parte di un compagno, lo dico.`}
                </p>
            </div>
            <div className="skills__rows">
                {BY_CATEGORY.map((c, i) => (
                    <Row key={c.cat} index={i} label={c.label} skills={c.skills} />
                ))}
            </div>
        </section>
    );
}
