// Tutti i progetti del portfolio, divisi in tre gruppi selezionabili:
// universitari, lavori (consegnati e online davvero) e dimostrativi (case study miei).
// Testi portati dal portfolio precedente.
import type { ReactNode } from "react";

export type ProjectGroup = "universitari" | "lavori" | "dimostrativi";

export const PROJECT_GROUPS: { id: ProjectGroup; label: string; note: string }[] = [
    { id: "universitari", label: "Universitari", note: "Progetti nati all'Unical, quasi tutti di gruppo: per ognuno dico qual è la mia parte." },
    { id: "lavori", label: "Lavori", note: "Cose che ho progettato, sviluppato e messo online davvero." },
    { id: "dimostrativi", label: "Dimostrativi", note: "Case study nati per mia iniziativa, non su commissione: li costruisco per mettere alla prova un'idea di design o una tecnologia. Nessun cliente dietro, dati e contatti sono segnaposto." },
];

export type Project = {
    id: string;
    group: ProjectGroup;
    /** Frase breve per la card (è anche la prima riga della scheda). */
    lead: string;
    category: string;
    title: string;
    src: string;
    skills: { frontend: string[]; backend: string[] };
    content: ReactNode;
    github?: string;
    live: string;
};

export const projects: Project[] = [
    {
        id: "ohima",
        group: "lavori",
        lead: "Piattaforma web full-stack per la pizzeria \"Ohima che pizza\".",
        category: "Sito Web & Gestionale",
        title: "Ohima che pizza",
        src: "/assets/projects-screenshots/ohimachepizza/home.webp",
        live: "https://www.ohimachepizza.it",
        github: "https://github.com/darioeliaaa/ohima-che-pizza",
        skills: {
            frontend: [
                "Angular",
                "Vercel",
            ],
            backend: [
                "Spring Boot",
                "Neon DB",
                "Render",
            ],
        },
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Piattaforma web full-stack per la pizzeria "Ohima che pizza".
                    </p>
                    <p>
                        Sviluppo di un ecosistema digitale completo gestendo l'intero ciclo di vita del software, dal frontend interattivo fino all'infrastruttura cloud e al database serverless.
                    </p>

                    <h3>Architettura e Stack</h3>
                    <ul>
                        <li><strong>Frontend:</strong> Componenti reattivi e modulari sviluppati in Angular, con deploy continuo e ottimizzato su Vercel.</li>
                        <li><strong>Backend:</strong> Sviluppo di API RESTful robuste e sicure in Java con Spring Boot, ospitate sull'infrastruttura cloud di Render.</li>
                        <li><strong>Database:</strong> Utilizzo di Neon (PostgreSQL in ambiente serverless) per garantire uno storage dei dati affidabile e ad alte prestazioni.</li>
                    </ul>
                </div>
            );
        },
    },
    {
        id: "moneymind",
        group: "universitari",
        lead: "Un'app per tenere in ordine i soldi di ogni giorno e provare a investire senza rischiare, con quotazioni reali.",
        category: "Finanza Personale & Trading",
        title: "MoneyMind",
        src: "/assets/projects-screenshots/moneyMind/home.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "HTML/CSS",
            ],
            backend: [
                "Java",
                "Spring Boot",
                "PostgreSQL",
            ],
        },
        live: "#",
        github: "https://github.com/darioeliaaa/PROG-WEB",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Un&apos;app per tenere in ordine i soldi di ogni giorno e provare a investire senza rischiare, con quotazioni reali.
                    </p>
                    <p>
                        Progetto universitario di gruppo, in quattro: l&apos;ho avviato io a
                        novembre 2025 e ho firmato 469 dei 740 commit. Ho scritto il simulatore di
                        compravendita con il prezzo medio di carico, la cache delle notizie e gran
                        parte del frontend Angular; accesso, quotazioni e trasferimenti tra wallet
                        li hanno fatti i miei compagni. A ottobre 2026 ho ridisegnato da capo tutta
                        l&apos;interfaccia, senza toccare le funzionalità. Le schermate mostrano dati
                        dimostrativi, non conti reali.
                    </p>

                    <h3>Il nuovo design: la stampa di sicurezza</h3>
                    <ul>
                        <li><strong>L&apos;identità viene dalle banconote:</strong> rosette guilloché sulle schede dei saldi, filo iridescente e microtesto. Le rosette non sono immagini: sono curve polari sovrapposte, calcolate in codice e disegnate in SVG.</li>
                        <li><strong>Un sistema di variabili CSS:</strong> carta verde-grigia, inchiostro scuro, un gradiente iridescente solo dove conta (saldi, wallet, accesso) e due colori per guadagno e perdita.</li>
                        <li><strong>Tipografia:</strong> Anybody per i titoli, Hanken Grotesk per il testo e Martian Mono per numeri ed etichette.</li>
                        <li><strong>Grafici su misura:</strong> Chart.js con font, colori e tooltip comuni a tutta l&apos;app; il grafico del titolo è il widget di TradingView ricolorato con la palette di MoneyMind.</li>
                        <li><strong>Desktop e telefono:</strong> barra laterale su schermo grande, barra a pillola in basso sul telefono, tabelle e grafici che non spingono mai la pagina oltre lo schermo.</li>
                    </ul>

                    <h3>Cosa fa</h3>
                    <ul>
                        <li><strong>Budget e movimenti:</strong> entrate e uscite per categoria, mese per mese, con riepilogo, ciambelle e andamento annuale.</li>
                        <li><strong>Wallet condivisi:</strong> conti in comune a cui si entra con un codice di invito, con budget mensile per membro e limite di prelievo.</li>
                        <li><strong>Market:</strong> quotazioni reali di azioni, ETF e crypto (Finnhub) e notizie finanziarie (NewsAPI).</li>
                        <li><strong>Trading simulato:</strong> acquisto e vendita con calcolo del prezzo medio di carico; il portafoglio mostra profitti, perdite e allocazione.</li>
                    </ul>

                    <h3>La mia parte, dietro le quinte</h3>
                    <ul>
                        <li><strong>Compravendita in un&apos;unica transazione:</strong> ogni acquisto o vendita aggiorna la posizione, il totale investito e il movimento di cassa dentro una sola <code>@Transactional</code>: o riesce tutto o non cambia niente. Il prezzo medio di carico si ricalcola a ogni acquisto.</li>
                        <li><strong>Cache delle notizie:</strong> <code>@Cacheable</code> con <code>@Scheduled</code> ogni 30 minuti, così la chiamata a NewsAPI parte al massimo una volta ogni mezz&apos;ora e il piano gratuito basta.</li>
                        <li><strong>Frontend Angular:</strong> componenti standalone e senza Zone.js, servizi con HttpClient, tutta la parte grafica e i grafici.</li>
                    </ul>
                    <p>
                        <strong>Onestà sui limiti:</strong> è una demo universitaria. Le API sono volutamente aperte
                        (lo dice anche il README) e gli importi sono in <code>double</code>: per portarla in produzione
                        servirebbero autenticazione con token e <code>BigDecimal</code>.
                    </p>
                </div>
            );
        },
    },
    {
        id: "tripify",
        group: "universitari",
        lead: "Piattaforma enterprise per la gestione dei viaggi e delle prenotazioni, sviluppata in team.",
        category: "Enterprise Travel App",
        title: "Tripify",
        src: "/assets/projects-screenshots/tripify/cover.webp",
        skills: {
            frontend: [
                "Kotlin",
                "Jetpack Compose",
                "Android Studio",
            ],
            backend: [
                "Java",
                "Spring Boot",
                "PostgreSQL",
                "Docker",
                "Keycloak",
                "RabbitMQ",
                "Cloudflare",
            ],
        },
        live: "#",
        github: "https://github.com/Matteoiazz/Enterprise-Project",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Piattaforma enterprise per la gestione dei viaggi e delle prenotazioni, sviluppata in team.
                    </p>
                    <p>
                        Progetto universitario enterprise realizzato tra Aprile e Luglio collaborando in un team di 4 persone. Tripify offre un'esperienza completa per la pianificazione e l'organizzazione di itinerari complessi, con un backend a microservizi e un client mobile nativo.
                    </p>

                    <h3>Backend a Microservizi</h3>
                    <ul>
                        <li><strong>Servizi:</strong> Spring Boot su Java 17 e Maven, con Spring Cloud Gateway come unico punto d'ingresso verso i client.</li>
                        <li><strong>Dati:</strong> Spring Data JPA su PostgreSQL per entità relazionali complesse (voli, hotel, prenotazioni, utenti).</li>
                        <li><strong>Sicurezza:</strong> OAuth2/OIDC con Keycloak come authorization server, per l'autenticazione centralizzata di tutti i servizi.</li>
                        <li><strong>Comunicazione:</strong> REST sincrono via Feign, messaggistica asincrona con RabbitMQ e aggiornamenti realtime via WebSocket/STOMP.</li>
                        <li><strong>Infrastruttura:</strong> containerizzato con Docker Compose ed esposto in HTTPS tramite tunnel Cloudflare.</li>
                    </ul>

                    <h3>Client Mobile Nativo</h3>
                    <p>
                        App Android nativa in Kotlin e Jetpack Compose, con Retrofit/OkHttp verso il gateway, AppAuth per il login OIDC e DataStore per la persistenza locale di preferenze e token.
                    </p>

                    <h3>Sviluppo in Team</h3>
                    <p>
                        Lavorare in un gruppo di 4 ha richiesto una forte coordinazione, un flusso Git ben strutturato e una rigorosa suddivisione dei task tra backend, mobile e infrastruttura.
                    </p>
                </div>
            );
        },
    },
    {
        id: "wavely",
        group: "universitari",
        lead: "Un’applicazione desktop per ascoltare musica, con un’interfaccia costruita da zero in JavaFX.",
        category: "Streaming Musicale",
        title: "Wave.ly",
        src: "/assets/projects-screenshots/wave.ly/home.webp",
        skills: {
            frontend: [
                "JavaFX",
            ],
            backend: [
                "Java",
                "SQLite",
            ],
        },
        live: "#",
        github: "https://github.com/darioeliaaa",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Un’applicazione desktop per ascoltare musica, con un’interfaccia costruita da zero in JavaFX.
                    </p>
                    <p>
                        Wave.ly consente di esplorare album, artisti e playlist, e si tinge del colore della copertina che sta suonando.
                    </p>

                    <h3>Funzionalità Sviluppate</h3>
                    <ul>
                        <li>Lettore a schermo intero con vinile animato, spettro audio in tempo reale e testo che scorre col brano.</li>
                        <li>Coda riordinabile con il trascinamento, riproduzione casuale e ripetizione di brano o lista.</li>
                        <li>Ricerca istantanea di brani, album e artisti, con risultati raggruppati.</li>
                        <li>Statistiche d'ascolto ed equalizzatore a 10 bande con preset.</li>
                        <li>Account e preferenze su SQLite, con password e codice di recupero cifrati.</li>
                    </ul>
                </div>
            );
        },
    },
    {
        id: "bulloneco",
        group: "universitari",
        lead: "Gestionale desktop per ottimizzare il magazzino e le operazioni di una ferramenta.",
        category: "Gestionale Ferramenta",
        title: "Bullone&Co",
        src: "/assets/projects-screenshots/bulloneeco/home.webp",
        skills: {
            frontend: [
                "JavaFX",
                "HTML/CSS",
            ],
            backend: [
                "Java",
                "SQLite",
            ],
        },
        live: "#",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Gestionale desktop per ottimizzare il magazzino e le operazioni di una ferramenta.
                    </p>
                    <p>
                        Una sfida che mi ha permesso di mettere in pratica concetti avanzati di ingegneria del software e design pattern architetturali per garantire massima scalabilità.
                    </p>

                    <h3>UI/UX & Pattern</h3>
                    <p>
                        <strong>Architettura a Livelli:</strong> Struttura solida basata sulla separazione tra strato Dati (DAO), Logica di Business (Service) e Presentazione (Controller).
                    </p>
                    <p>
                        <strong>Pattern Strategy:</strong> Utilizzato per il calcolo dinamico del valore del magazzino, scambiando a runtime algoritmi di pricing e svalutazione temporale.
                    </p>
                    <p>
                        <strong>Interfaccia:</strong> Estetica da officina, con catalogo a scaffali, cassetta di prenotazione e report del magazzino con KPI aggiornati live.
                    </p>
                </div>
            );
        },
    },
    {
        id: "portfolio",
        group: "lavori",
        lead: "Il mio biglietto da visita digitale, alla seconda versione: una postazione da programmatore che si costruisce mentre scorri.",
        category: "Portfolio Personale",
        title: "Dario Elia - Portfolio",
        src: "/assets/projects-screenshots/portfolio/v2.jpg",
        live: "https://www.darioelia.it",
        github: "https://github.com/darioeliaaa/Dario-portfolio",
        skills: {
            frontend: ["TypeScript", "Next.js", "Three.js", "GSAP"],
            backend: [],
        },
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Il mio biglietto da visita digitale, alla seconda versione.
                    </p>
                    <p>
                        La seconda versione (ottobre 2026) è rifatta da zero in Next.js e TypeScript, con CSS su
                        misura e un impianto editoriale a colonne. All&apos;apertura un MacBook Air M4 scrive
                        &quot;ciao&quot; sullo schermo; scorrendo, sotto di lui prende forma una postazione da
                        programmatore: scrivania, lampada, libri con la bussola, tazza di caffè, quaderno, post-it e
                        cuffie.
                    </p>

                    <h3>Cosa c&apos;è dentro</h3>
                    <ul>
                        <li><strong>Scena 3D generata da codice:</strong> il MacBook, la scrivania e ogni oggetto sono costruiti con le primitive di Three.js, nessun modello scaricato. Sullo schermo il codice si scrive mentre la postazione si completa.</li>
                        <li><strong>Scroll guidato:</strong> GSAP ScrollTrigger e Lenis; la scena smette di disegnare quando non è visibile.</li>
                        <li><strong>Progetti in tre gruppi:</strong> universitari, lavori e dimostrativi, ognuno con la galleria delle schermate.</li>
                        <li><strong>Il resto:</strong> form contatti con validazione sul server, tema chiaro e scuro, pagina CV, sitemap, dati strutturati e immagini di anteprima generate.</li>
                    </ul>

                    <h3>La prima versione</h3>
                    <p>
                        Non era solo un semplice contenitore di informazioni, ma la dimostrazione pratica della mia
                        cura per il frontend: dalla tastiera 3D interattiva, dove ogni tasto era una tecnologia,
                        all&apos;adattabilità responsiva con Tailwind CSS.
                    </p>
                    <p>
                        Partiva dal template open source di Naresh Khatri, che ho riscritto e personalizzato: sezioni,
                        gallerie, form contatti, CV e SEO. La tastiera 3D era una scena Spline: l&apos;ho riscritta
                        da zero in Three.js, con 37 tasti generati da codice, uno per ogni tecnologia che uso o che ho
                        studiato. Le schermate della galleria qui sopra sono di quella versione.
                    </p>
                </div>
            );
        },
    },
    {
        id: "ottone",
        group: "dimostrativi",
        lead: "Atelier di telai da bicicletta su misura, con un configuratore 3D che ricostruisce la geometria vera a ogni taglia.",
        category: "E-Commerce Avanzato · Case Study",
        title: "Ottone — Telai a Novi Ligure",
        src: "/assets/projects-screenshots/ottone/ottone.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "Three.js",
            ],
            backend: ["Angular SSR", "Express"],
        },
        live: "https://ottone-telai.vercel.app",
        github: "https://github.com/darioeliaaa/ottone-telai",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Atelier di telai da bicicletta su misura, con un configuratore 3D che
                        ricostruisce la geometria vera a ogni taglia.
                    </p>
                    <p>
                        Un case study personale, non un incarico commissionato: la fascia
                        &quot;E-Commerce Avanzato&quot; del mio listino, quella dove doveva
                        succedere qualcosa che i tre progetti precedenti non avevano ancora
                        mostrato. Un telaista di Novi Ligure — il paese di Coppi, non a caso —
                        che vende telai in acciaio brasati a mano. L&apos;idea di partenza era
                        smettere di far finta: la maggior parte dei &quot;configuratori 3D&quot;
                        cambia una texture su un modello fisso. Qui il telaio{" "}
                        <strong>non esiste finché non scegli la taglia</strong> — i tubi sono
                        cilindri disegnati fra punti calcolati dalle quote reali (stack, reach,
                        angolo sterzo, carro), quindi passare dalla 48 alla 60 allunga e alza la
                        bici sul serio, non la scala.
                    </p>

                    <h3>Un telaio è geometria, non un modello</h3>
                    <ul>
                        <li><strong>Motore di geometria condiviso:</strong> una funzione converte le quote da telaista (stack, reach, angoli, carro) in punti 3D, e la stessa funzione disegna sia il telaio in Three.js nel configuratore sia il profilo SVG piatto usato in catalogo — cambiando taglia le differenze si vedono davvero, sui due lati.</li>
                        <li><strong>Vista esplosa:</strong> i tubi si allontanano dai giunti per mostrare la brasatura, il mestiere che dà il nome all&apos;officina.</li>
                        <li><strong>Disponibilità reale:</strong> non un flag sì/no sul prodotto — dipende dalla combinazione tubo × taglia × modello. L&apos;inox non si brasa sui telai da pista, e la riga si disattiva col motivo scritto, non con un generico &quot;non disponibile&quot;.</li>
                    </ul>

                    <h3>Un Web Worker per la taglia, IndexedDB per il carrello</h3>
                    <ul>
                        <li><strong>Calcolo della taglia su un thread a parte:</strong> un Web Worker vero riceve statura, cavallo e apertura braccia e restituisce la taglia consigliata; in SSR/prerendering — dove i Worker non esistono — la stessa funzione pura gira in linea, così il risultato non può divergere fra le due strade.</li>
                        <li><strong>Carrello su IndexedDB</strong> invece di localStorage: dentro finiscono configurazioni intere (tubi, colore, giunti, extra), non una stringa da serializzare a mano.</li>
                        <li><strong>Proforma PDF generata nel browser</strong> con pdf-lib, per l&apos;area rivenditori: intestazione, righe, IVA, totale, scaricata al momento — nessun server coinvolto.</li>
                        <li><strong>Configurazione nell&apos;URL:</strong> ogni scelta si scrive nella query string, il link riapre il telaio esattamente com&apos;era lasciato.</li>
                    </ul>

                    <h3>Sotto il cofano</h3>
                    <p>
                        <strong>Angular 22</strong> standalone e zoneless, <strong>SSR con
                        prerendering</strong> di tutte e 15 le pagine, sitemap e robots.txt
                        generati leggendo la build reale. Comparse allo scroll in CSS puro
                        (<code>animation-timeline: view()</code>), niente libreria di
                        animazione. Zero fotografie: ogni telaio, in 3D o in SVG, è disegnato
                        dalle sue quote.
                    </p>
                </div>
            );
        },
    },
    {
        id: "piccantomane",
        group: "dimostrativi",
        lead: "E-commerce completo per un produttore di salse piccanti calabresi.",
        category: "E-Commerce · Case Study",
        title: "Piccantomane",
        src: "/assets/projects-screenshots/piccantomane/piccantomane.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "Three.js",
                "GLSL",
            ],
            backend: ["Angular SSR", "Express"],
        },
        live: "https://piccantemane.vercel.app",
        github: "https://github.com/darioeliaaa/piccantemane",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        E-commerce completo per un produttore di salse piccanti calabresi.
                    </p>
                    <p>
                        Un case study personale, non un incarico commissionato: la fascia
                        &quot;E-Commerce Base&quot; del mio listino, con dentro il 3D vero.
                        L&apos;idea di partenza era scappare dall&apos;estetica da e-shop
                        gourmet — bottiglia fotografata in controluce, fondo bianco, tre
                        peperoncini come indicatore di piccantezza — e trattare ogni salsa
                        come una <strong>sostanza da classificare</strong>: classe di rischio
                        in etichetta, gradi Scoville reali, scheda di sicurezza.
                    </p>

                    <h3>Il 3D, non finto</h3>
                    <ul>
                        <li><strong>Bottiglia interattiva in Three.js:</strong> geometria costruita a runtime con <code>LatheGeometry</code> da un profilo disegnato a mano — nessun modello scaricato — vetro con <code>transmission</code> fisica e riflessi da ambiente PBR. Si trascina per ruotarla, gira da sola quando è ferma.</li>
                        <li><strong>Etichetta come texture:</strong> disegnata su <code>&lt;canvas&gt;</code> mentre la pagina gira e avvolta sulla bottiglia, con la stessa composizione grafica della versione piatta usata nel catalogo.</li>
                        <li><strong>Sfondo a fuoco in GLSL:</strong> uno shader scritto a mano (fbm su rumore a valore, cinque ottave), non un video di fiamme preso da uno stock.</li>
                    </ul>

                    <h3>L&apos;e-commerce sotto</h3>
                    <ul>
                        <li><strong>Catalogo</strong> di 12 salse su quattro linee, filtrabile e ordinabile per piccantezza, con formati e prezzi diversi per prodotto.</li>
                        <li><strong>Carrello persistente:</strong> signal Angular specchiati in <code>localStorage</code>, ma letti solo dopo l&apos;idratazione — altrimenti l&apos;HTML del client non combacia con quello prerenderizzato dal server.</li>
                        <li><strong>Checkout completo</strong> con Reactive Forms e validazione vera (carta, CAP, email). Il pagamento è dichiaratamente simulato: la logica è pronta, manca solo il gateway.</li>
                        <li><strong>Pannello ordini</strong> per il negoziante, filtrabile per stato, con tracking — la voce &quot;gestione ordini&quot; del listino, resa visibile invece che promessa.</li>
                    </ul>

                    <h3>Due dati di piccantezza, non stelline</h3>
                    <p>
                        Un <strong>manometro Scoville</strong> su scala logaritmica — lineare,
                        la salsa più dolce e la più estrema finirebbero a un millimetro di
                        distanza sullo stesso ago — e un <strong>diamante di degustazione</strong>
                        che riprende la geometria del diamante di classificazione delle
                        sostanze chimiche, riletto come scheda di gusto: aroma, acidità,
                        persistenza.
                    </p>

                    <h3>Sotto il cofano</h3>
                    <p>
                        <strong>Angular 22</strong> standalone e zoneless, <strong>SSR con
                        prerendering</strong> di tutte e 20 le pagine, sitemap e robots.txt
                        generati leggendo la build reale. Zero fotografie in tutto il sito:
                        bottiglie, manometro e diamante sono disegnati o generati.
                    </p>
                </div>
            );
        },
    },
    {
        id: "sidero",
        group: "dimostrativi",
        lead: "Sito aziendale bilingue per una cantina vitivinicola con vocazione all'export.",
        category: "Sito Aziendale · Case Study",
        title: "Sìdero — Cantina in Cirò",
        src: "/assets/projects-screenshots/sidero/sidero.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "HTML/CSS",
            ],
            backend: ["Angular SSR", "Express"],
        },
        live: "https://sidero-cantina.vercel.app",
        github: "https://github.com/darioeliaaa/sidero-cantina",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Sito aziendale bilingue per una cantina vitivinicola con
                        vocazione all&apos;export.
                    </p>
                    <p>
                        Un case study personale, non un incarico commissionato: la fascia
                        &quot;Sito Aziendale&quot; del mio listino. Il punto non era fare
                        l&apos;ennesima brochure di vino — foto di vigneto al tramonto,
                        serif dorato, &quot;la nostra passione dal 1968&quot; — ma un
                        <strong> archivio</strong>: ogni vino è una scheda catalogata, ogni
                        parcella una voce con i suoi dati, il territorio una sezione
                        stratigrafica. Carta di calce, inchiostro ferroso, righe sottili
                        come su una tavola catastale.
                    </p>

                    <h3>Il colore lo decide il vino</h3>
                    <p>
                        L&apos;unico colore forte del sito è il vino stesso: una variabile
                        CSS cambia da una scheda all&apos;altra — rubino, buccia di cipolla,
                        oro paglierino, granato — e con lei si tingono testata, tacche del
                        profilo e bordi dei campi. Quattro etichette, quattro pagine che
                        sembrano quattro posti diversi, con un foglio di stile solo.
                    </p>
                    <p>
                        Nessuna fotografia in tutto il sito: la mappa delle sei parcelle, la
                        sezione del suolo fino a tre metri, la ruota dell&apos;anno in vigna
                        e lo schema stradale sono <strong>SVG disegnati a mano</strong>.
                    </p>

                    <h3>Multilingua, non &quot;tradotto&quot;</h3>
                    <ul>
                        <li><strong>Slug diversi per lingua:</strong> <code>/it/vini</code> e <code>/en/wines</code> sono due URL distinti e indicizzabili, con hreflang e x-default; il selettore lingua resta sulla stessa pagina invece di rimbalzare in home.</li>
                        <li><strong>Contenuti diversi, non traduzioni:</strong> la pagina Distribuzione in italiano parla a un ristorante — cartoni da sei, consegna in settimana, agente di zona. In inglese parla a un importatore — pallet interi, Incoterms, e-AD, esclusiva di territorio. Due pubblici, due domande diverse.</li>
                        <li><strong>Anche i title:</strong> in inglese le schede vino puntano su &quot;Gaglioppo from Cirò, Calabria&quot;, non sulla denominazione italiana per esteso che in inglese non cerca nessuno.</li>
                    </ul>

                    <h3>Architettura</h3>
                    <ul>
                        <li><strong>Angular 22</strong> standalone e zoneless, due alberi di route (uno per lingua): dieci componenti coprono <strong>trenta indirizzi</strong>.</li>
                        <li><strong>SSR e prerendering</strong> di tutte e 30 le pagine, schede vino e articoli inclusi, generati da <code>getPrerenderParams</code>.</li>
                        <li><strong>Sitemap e robots.txt generati dalla build</strong>, leggendo le pagine appena prerenderizzate: non possono divergere dal sito reale.</li>
                        <li><strong>Form B2B</strong> che mostra il payload JSON pronto per un webhook verso Airtable o HubSpot, con la lingua della richiesta già dentro — il commerciale deve sapere in che lingua richiamare.</li>
                    </ul>

                    <h3>SEO</h3>
                    <p>
                        Title e description per pagina e per lingua, canonical e hreflang
                        reciproci, structured data schema.org <code>Winery</code> con
                        indirizzo, coordinate e orari, e redirect 308 dalla root alla lingua
                        predefinita gestito lato server. Azienda, dati e contatti sono di
                        fantasia.
                    </p>
                </div>
            );
        },
    },
    {
        id: "pelaggi",
        group: "dimostrativi",
        lead: "Sito vetrina per un'azienda agricola con frantoio di proprietà.",
        category: "Sito Vetrina · Case Study",
        title: "Azienda Agricola",
        src: "/assets/projects-screenshots/pelaggi/home.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "HTML/CSS",
            ],
            backend: ["Angular SSR", "Express"],
        },
        live: "https://sito-pelaggi.vercel.app",
        github: "https://github.com/darioeliaaa/sitoAziendaAgricola",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Sito vetrina per un&apos;azienda agricola con frantoio di proprietà.
                    </p>
                    <p>
                        Un case study personale, non un incarico commissionato: l&apos;ho
                        costruito per mettere alla prova il rendering server-side di Angular
                        su un sito dove la SEO locale è tutto, con un&apos;identità da marchio
                        vero. I contatti, i prezzi e i dati aziendali nella demo sono
                        volutamente dei segnaposto.
                    </p>

                    <h3>Identità visiva</h3>
                    <ul>
                        <li><strong>La palette dell&apos;invaiatura:</strong> i colori dell&apos;oliva che matura (verde acerbo, paglia, violaceo, nero) diventano i blocchi colorati delle sezioni, tutti come variabili CSS.</li>
                        <li><strong>Tipografia:</strong> Caprasimo per i titoli, Figtree per il testo e Red Hat Mono per etichette, orari e valori di laboratorio.</li>
                        <li><strong>Illustrazioni in SVG:</strong> bottiglia, latte, un rametto con le olive che cambiano colore dalla base alla punta e bollini che girano, tutti componenti Angular. Nessuna immagine da scaricare e nitide a ogni risoluzione.</li>
                    </ul>

                    <h3>Architettura</h3>
                    <ul>
                        <li><strong>Angular 21</strong> con componenti standalone, senza Zone.js e con i signal per lo stato, su quattro pagine (Home, Frantoio, Chi Siamo, Contatti).</li>
                        <li><strong>SSR e prerendering:</strong> <code>@angular/ssr</code> su Express, con tutte le rotte generate staticamente in fase di build e l&apos;idratazione lato client.</li>
                        <li><strong>Parti interattive:</strong> la scheda di assaggio delle tre varietà (fruttato, amaro e piccante su scala 0–10, navigabile anche da tastiera), il calendario dell&apos;uliveto che si apre sul mese corrente e la scheda analitica confrontata con i limiti di legge.</li>
                        <li><strong>Form reattivi:</strong> il modulo contatti cambia campi in base alla richiesta (ordine, visita, molitura) e arriva già compilato dai bottoni &quot;Ordina&quot; del sito, tramite i parametri dell&apos;URL.</li>
                    </ul>

                    <h3>SEO locale</h3>
                    <p>
                        Il punto dell&apos;esercizio: un title per ogni pagina e meta description
                        scritti attorno alla query che conta davvero (&quot;olio extravergine a Strongoli&quot;),
                        Open Graph per l&apos;anteprima su WhatsApp e Instagram, <code>lang=&quot;it&quot;</code>,
                        theme-color per la barra del browser su mobile e HTML già renderizzato
                        alla prima richiesta, senza aspettare il JavaScript.
                    </p>
                </div>
            );
        },
    },
    {
        id: "trediciTattoo",
        group: "dimostrativi",
        lead: "Sito vetrina multi-pagina per uno studio di tatuaggi indipendente.",
        category: "Sito Vetrina · Case Study",
        title: "TREDICI — Studio di Tatuaggi",
        src: "/assets/projects-screenshots/trediciTattoo/trediciTattoo.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "HTML/CSS",
            ],
            backend: ["Angular SSR", "Express"],
        },
        live: "https://tredici-tattoo.vercel.app",
        github: "https://github.com/darioeliaaa/tredici-tattoo",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Sito vetrina multi-pagina per uno studio di tatuaggi indipendente.
                    </p>
                    <p>
                        Un case study personale, non un incarico commissionato: la fascia
                        &quot;Sito Vetrina&quot; del mio listino, portata al limite. Il punto
                        di partenza non era una griglia di card qualunque ma un vero foglio
                        flash da studio — carta chiara, inchiostro nero, un solo colore
                        d&apos;accento: il viola da stencil transfer, quello del ricalco
                        sulla pelle prima di tatuare.
                    </p>

                    <h3>Un&apos;estetica fuori dagli schemi</h3>
                    <ul>
                        <li><strong>Foglio flash vero:</strong> i 12 pezzi disponibili sono card in stile flash sheet, con icone disegnate a mano (sprite SVG) invece delle solite foto stock.</li>
                        <li><strong>Tipografia da locandina:</strong> un display serif deciso per i titoli e un monospace da macchina da scrivere per il corpo, a rompere la solita coppia sans-serif/sans-serif dei siti generati con l&apos;IA.</li>
                        <li><strong>Un solo accento cromatico:</strong> il viola stencil compare col contagocce — su carta chiara e inchiostro nero, basta e avanza.</li>
                    </ul>

                    <h3>Architettura</h3>
                    <ul>
                        <li><strong>Angular 22</strong> standalone e <strong>zoneless</strong>, con routing lazy-loaded su 6 pagine (Home, Galleria, Artisti, Stili &amp; Prezzi, Prenota, Contatti).</li>
                        <li><strong>SSR e prerendering:</strong> <code>@angular/ssr</code>, tutte le rotte generate staticamente in build — zero server Node necessario in produzione.</li>
                        <li><strong>Galleria a signal:</strong> il filtro per stile (Blackwork/Fineline/Tradizionale) è un signal, non manipolazione diretta del DOM.</li>
                        <li><strong>Prenotazione:</strong> Reactive Form con upload di riferimento immagine e validazione su artista, stile, zona del corpo e dimensione.</li>
                    </ul>

                    <h3>SEO &amp; dati locali</h3>
                    <p>
                        Ogni pagina imposta il proprio <code>title</code> e <code>description</code>
                        dal componente stesso, e nell&apos;<code>&lt;head&gt;</code> è iniettato
                        structured data schema.org (<code>TattooParlor</code>) con indirizzo e
                        orari leggibili direttamente da Google — lo stesso trattamento che
                        userei per un cliente vero con un negozio fisico da far trovare.
                    </p>
                </div>
            );
        },
    },
    {
        id: "unaNotteDiStelle",
        group: "dimostrativi",
        lead: "Landing page per un evento immaginario di osservazione astronomica.",
        category: "Landing Page · Case Study",
        title: "Una Notte di Stelle",
        src: "/assets/projects-screenshots/unaNotteDiStelle/unaNotteDiStelle.webp",
        skills: {
            frontend: [
                "Angular",
                "TypeScript",
                "HTML/CSS",
            ],
            backend: ["Angular SSR", "Express"],
        },
        live: "https://una-notte-di-stelle.vercel.app",
        github: "https://github.com/darioeliaaa/una-notte-di-stelle",
        get content() {
            return (
                <div>
                    <p className="pd-lead">
                        Landing page per un evento immaginario di osservazione astronomica.
                    </p>
                    <p>
                        Un case study personale, non un incarico commissionato: la fascia
                        &quot;Landing Page&quot; del mio listino, per un evento inventato di
                        osservazione delle Geminidi sul Piano di Lorica, in Sila. L&apos;idea
                        di partenza era trattare la pagina come una vera carta del cielo,
                        non l&apos;ennesima one-page a sezioni impilate.
                    </p>

                    <h3>Una pagina come una carta del cielo</h3>
                    <ul>
                        <li><strong>Cielo animato:</strong> un canvas 2D disegna a mano stelle e stelle cadenti, senza nessuna libreria di grafica di terze parti.</li>
                        <li><strong>Costellazione che si scrive:</strong> una linea SVG collega le sezioni una a una mentre scorri, invece del solito indicatore di progresso a barra.</li>
                        <li><strong>Countdown a quadrante:</strong> il conto alla rovescia è un quadrante con le tacche disegnato su misura, non l&apos;ennesimo orologio digitale copiaincollato.</li>
                    </ul>

                    <h3>Architettura</h3>
                    <ul>
                        <li><strong>Angular 22</strong> standalone e <strong>zoneless</strong>: countdown, form e animazioni di reveal allo scroll girano tutti su signal.</li>
                        <li><strong>SSR e prerendering:</strong> <code>@angular/ssr</code> genera HTML statico reale per i crawler, non una pagina vuota in attesa di JavaScript.</li>
                        <li><strong>Countdown SSR-corretto:</strong> il valore iniziale si calcola in modo sincrono nel costruttore (pura <code>Date</code>, nessun DOM), così anche l&apos;HTML pre-renderizzato mostra il numero vero.</li>
                        <li><strong>Form di prenotazione:</strong> Reactive Form per iscriversi alla serata, con validazione dei campi.</li>
                    </ul>

                    <h3>SEO</h3>
                    <p>
                        Title e description impostati via <code>Title</code>/<code>Meta</code>
                        di Angular, Open Graph per l&apos;anteprima su WhatsApp e Instagram,
                        <code>lang=&quot;it&quot;</code>, <code>robots.txt</code> e
                        <code>sitemap.xml</code> — la data e il luogo dell&apos;evento nella
                        demo sono volutamente inventati.
                    </p>
                </div>
            );
        },
    },
];
