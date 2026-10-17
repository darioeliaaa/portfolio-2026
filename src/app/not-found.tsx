import Link from "next/link";

export default function NotFound() {
    return (
        <section className="notfound">
            <div className="outline-word notfound__word" aria-hidden>
                404
            </div>
            <h1 className="sr-only">Pagina non trovata</h1>
            <p className="notfound__text">Questa pagina non esiste (ancora). Il resto del sito sì.</p>
            <Link href="/" className="btn btn--solid">
                Torna alla home
            </Link>
        </section>
    );
}
