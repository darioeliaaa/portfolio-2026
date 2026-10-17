/**
 * Titolo di sezione: una parola enorme in serif corsivo, solo contorno, e sopra
 * il titolo vero in grottesco (come "Selected / Work" nel riferimento).
 */
export default function SectionTitle({
    outline,
    solid,
    id,
    eyebrow,
}: {
    outline: string;
    solid: string;
    id?: string;
    eyebrow?: string;
}) {
    return (
        <header className="stitle" data-reveal>
            {eyebrow && <p className="stitle__eyebrow mono">{eyebrow}</p>}
            <h2 className="stitle__h" id={id}>
                <span className="stitle__outline outline-word" aria-hidden>
                    {outline}
                </span>
                <span className="stitle__solid">{solid}</span>
            </h2>
        </header>
    );
}
