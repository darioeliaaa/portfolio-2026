import { config } from "@/data/config";
import {
    CASE_NOTE,
    CASE_STUDIES,
    EDUCATION_CV,
    EXPERIENCE_CV,
    GDPR,
    LANGUAGES,
    MAIN_PROJECTS,
    PORTFOLIO_CARD,
    PROFILE,
    ROLE_LINE,
    SKILL_GROUPS,
    UNI_PROJECTS,
    WORK_STYLE,
    type Card,
    type Entry,
    type Part,
} from "./cv-data";

function Parts({ parts }: { parts: Part[] }) {
    return (
        <>
            {parts.map((p, i) =>
                typeof p === "string" ? (
                    <span key={i}>{p}</span>
                ) : (
                    <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="u-line">
                        {p.label}
                    </a>
                ),
            )}
        </>
    );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="cv__block cols">
            <h2 className="cv__h mono">{title}</h2>
            <div className="cv__body">{children}</div>
        </section>
    );
}

function EntryView({ e }: { e: Entry }) {
    return (
        <article className="cv__entry">
            <header>
                <h3>{e.title}</h3>
                <p className="mono cv__when">{e.when}</p>
            </header>
            {e.meta && (
                <p className="cv__meta">
                    <Parts parts={e.meta} />
                </p>
            )}
            {e.bullets && (
                <ul>
                    {e.bullets.map((b, i) => (
                        <li key={i}>
                            {b.label && <strong>{b.label} </strong>}
                            {b.text}
                        </li>
                    ))}
                </ul>
            )}
            {e.tags && <p className="cv__tags mono">{e.tags.join(" · ")}</p>}
        </article>
    );
}

function CardView({ c }: { c: Card }) {
    return (
        <article className="cv__entry">
            <header>
                <h3>
                    {c.titleLink ? (
                        <a href={c.titleLink.href} target="_blank" rel="noopener noreferrer">
                            {c.title}
                        </a>
                    ) : (
                        c.title
                    )}
                </h3>
            </header>
            {c.meta && (
                <p className="cv__meta">
                    <Parts parts={c.meta} />
                </p>
            )}
            <p>
                <Parts parts={c.text} />
            </p>
            {c.mine && (
                <p>
                    <strong>{c.mine.label} </strong>
                    {c.mine.text}
                </p>
            )}
        </article>
    );
}

export default function CvView() {
    return (
        <div className="cv">
            <div className="cv__top cols">
                <a href="/" className="paren link-u no-print">
                    Torna al portfolio
                </a>
                <p className="mono muted cv__note no-print">
                    Questa è la versione web del curriculum. Il file ufficiale è il PDF qui accanto.
                </p>
                <a href={config.cv.href} download={config.cv.filename} className="btn btn--solid cv__dl no-print">
                    Scarica il CV (PDF) ↓
                </a>
            </div>

            <header className="cv__head">
                <p className="outline-word cv__word" aria-hidden>
                    Curriculum
                </p>
                <h1 className="cv__name">{config.author}</h1>
                <p className="cv__role">{ROLE_LINE}</p>
                <p className="cv__contacts mono">
                    <span>{config.location}</span>
                    {config.email && <a href={`mailto:${config.email}`}>{config.email}</a>}
                    <a href={config.social.github} target="_blank" rel="noopener noreferrer">
                        github.com/{config.githubUsername}
                    </a>
                    <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                    <a href={config.site}>{config.site.replace("https://", "")}</a>
                </p>
            </header>

            <Block title="Profilo">
                <p className="cv__profile">{PROFILE}</p>
            </Block>
            <Block title="Esperienza">
                {EXPERIENCE_CV.map((e) => (
                    <EntryView key={e.title} e={e} />
                ))}
            </Block>
            <Block title="Progetti principali">
                {MAIN_PROJECTS.map((e) => (
                    <EntryView key={e.title} e={e} />
                ))}
            </Block>
            <Block title="Altri progetti universitari">
                {UNI_PROJECTS.map((c) => (
                    <CardView key={c.title} c={c} />
                ))}
            </Block>
            <Block title="Case study">
                <p className="muted cv__casenote">{CASE_NOTE}</p>
                {CASE_STUDIES.map((c) => (
                    <CardView key={c.title} c={c} />
                ))}
                <CardView c={PORTFOLIO_CARD} />
            </Block>
            <Block title="Competenze">
                <dl className="cv__skills">
                    {SKILL_GROUPS.map((g) => (
                        <div key={g.title}>
                            <dt>{g.title}</dt>
                            <dd>{g.skills}</dd>
                        </div>
                    ))}
                </dl>
            </Block>
            <Block title="Formazione">
                {EDUCATION_CV.map((e) => (
                    <article key={e.title} className="cv__entry">
                        <header>
                            <h3>{e.title}</h3>
                            <p className="mono cv__when">{e.when}</p>
                        </header>
                        <p className="cv__meta">{e.org}</p>
                    </article>
                ))}
            </Block>
            <Block title="Lingue">
                <dl className="cv__skills">
                    {LANGUAGES.map((l) => (
                        <div key={l.name}>
                            <dt>{l.name}</dt>
                            <dd>{l.level}</dd>
                        </div>
                    ))}
                </dl>
            </Block>
            <Block title="Come lavoro">
                <p>{WORK_STYLE}</p>
            </Block>
            <p className="cv__gdpr cols">
                <span />
                <span>{GDPR}</span>
            </p>
        </div>
    );
}
