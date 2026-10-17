import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COLORS, blobShadowTexture, canvasTexture, mesh, phys, std, woodTexture } from "./materials";
import { CODE_LENGTH, ScreenTexture, roundRect, type Fonts } from "./screen";
import { makeCompass } from "./compass";

/**
 * La postazione da programmatore.
 * All'inizio c'è solo il MacBook (Air 13" M4, Midnight) che scrive "ciao";
 * scorrendo, sotto prende forma la scrivania e arrivano gli oggetti uno alla volta.
 *
 *   intro    0 → 1  : primo piano sullo schermo, poi la camera si allontana
 *   progress 0 → 1  : la postazione si costruisce (guidato dallo scroll)
 *
 * Unità: 1 = 10 cm. Il piano della scrivania sta a y = 0.
 */

type Appear = { node: THREE.Object3D; a: number; b: number; kind: "drop" | "grow" | "pop"; base: THREE.Vector3; scale: THREE.Vector3 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => {
    const c1 = 1.5;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

type Pose = { pos: THREE.Vector3; target: THREE.Vector3; shift: number };
const pose = (px: number, py: number, pz: number, tx: number, ty: number, tz: number, shift: number): Pose => ({
    pos: new THREE.Vector3(px, py, pz),
    target: new THREE.Vector3(tx, ty, tz),
    shift,
});

export type WorkstationOptions = { fonts: Fonts; theme: "light" | "dark"; mobile: boolean };

export class Workstation {
    private renderer: THREE.WebGLRenderer;
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(30, 1, 0.5, 90);
    private screen: ScreenTexture;
    private appears: Appear[] = [];
    private lid = new THREE.Group();
    private macbook = new THREE.Group();
    private blob: THREE.Mesh;
    private desk = new THREE.Group();
    private legs = new THREE.Group();
    private steam: THREE.Mesh[] = [];
    private lampLight: THREE.SpotLight;
    private lampBulb: THREE.MeshStandardMaterial;
    private screenGlow: THREE.PointLight;
    private hemi: THREE.HemisphereLight;
    private sun: THREE.DirectionalLight;
    private needle: THREE.Group | null = null;
    private hero = { cx: 0.5, cy: 0.66, w: 0.26, h: 0.4 };
    private fog: THREE.Fog;
    private envTex: THREE.Texture;

    private intro = 0;
    private progress = 0;
    private width = 1;
    private height = 1;
    private raf = 0;
    private running = false;
    private t0 = performance.now();
    private elapsed = () => (performance.now() - this.t0) / 1000;
    private quackT = -10;

    private readonly poses = {
        intro: pose(0, 2.55, 3.35, 0, 1.08, -1.39, 0),
        hero: pose(0, 3.6, 10.6, 0, 0.75, -0.3, 0.17),
        build: pose(-1.2, 6.4, 12.6, 0, 0.2, -0.5, 0.02),
        final: pose(-2.3, 9.4, 13.4, 0.2, -0.4, -0.7, -0.07),
    };

    constructor(canvas: HTMLCanvasElement, private opts: WorkstationOptions) {
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.6 : 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.02;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.setClearColor(0x000000, 0);

        const pmrem = new THREE.PMREMGenerator(this.renderer);
        this.envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();
        this.scene.environment = this.envTex;
        this.scene.environmentIntensity = 0.55;

        this.fog = new THREE.Fog(0xf1f1f1, 16, 34);
        this.scene.fog = this.fog;

        // luci
        this.hemi = new THREE.HemisphereLight(0xffffff, 0xcfcfcf, 0.9);
        this.scene.add(this.hemi);
        this.sun = new THREE.DirectionalLight(0xffffff, 2.1);
        this.sun.position.set(-6, 14, 8);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(opts.mobile ? 1024 : 2048, opts.mobile ? 1024 : 2048);
        const sc = this.sun.shadow.camera;
        sc.left = -10;
        sc.right = 10;
        sc.top = 8;
        sc.bottom = -8;
        sc.near = 2;
        sc.far = 40;
        this.sun.shadow.bias = -0.0004;
        this.sun.shadow.normalBias = 0.02;
        this.sun.shadow.radius = 5;
        this.scene.add(this.sun);

        this.screen = new ScreenTexture(opts.fonts);
        this.screenGlow = new THREE.PointLight(0x9fb8ff, 0.0, 6, 2);
        this.screenGlow.position.set(0, 1.2, -0.4);
        this.scene.add(this.screenGlow);

        this.buildMacBook();
        this.blob = new THREE.Mesh(
            new THREE.PlaneGeometry(4.6, 3.4),
            new THREE.MeshBasicMaterial({ map: blobShadowTexture(), transparent: true, depthWrite: false }),
        );
        this.blob.rotation.x = -Math.PI / 2;
        this.blob.position.set(0, 0.002, 0.05);
        this.scene.add(this.blob);

        this.buildDesk();
        this.buildItems();

        const lamp = this.buildLamp();
        this.lampLight = lamp.light;
        this.lampBulb = lamp.bulb;

        this.setTheme(opts.theme);
        this.apply();
    }

    // ------------------------------------------------------------------
    // MacBook Air 13" M4 — 30,4 × 21,5 × 1,13 cm
    // ------------------------------------------------------------------
    private buildMacBook() {
        const W = 3.04;
        const D = 2.15;
        const midnight = std(COLORS.midnight, 0.36, 0.82);
        const midnightMatte = std(COLORS.midnight, 0.48, 0.75);
        const keyMat = std(COLORS.keys, 0.62, 0.05);

        const base = mesh(new RoundedBoxGeometry(W, 0.07, D, 4, 0.03), midnight);
        base.position.y = 0.035;
        this.macbook.add(base);

        // tastiera: le righe come su quella vera (unità = 1 tasto)
        const u = 0.185;
        const rows: { z: number; depth: number; keys: number[] }[] = [
            { z: -0.79, depth: 0.085, keys: Array(13).fill(1.0).concat([1.0]) },
            { z: -0.62, depth: 0.155, keys: Array(13).fill(1).concat([1.5]) },
            { z: -0.435, depth: 0.155, keys: [1.5].concat(Array(13).fill(1)) },
            { z: -0.25, depth: 0.155, keys: [1.8].concat(Array(11).fill(1), [1.7]) },
            { z: -0.065, depth: 0.155, keys: [2.3].concat(Array(10).fill(1), [2.2]) },
            { z: 0.12, depth: 0.155, keys: [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1] },
        ];
        const keyGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.18);
        const total = rows.reduce((n, r) => n + r.keys.length, 0);
        const keys = new THREE.InstancedMesh(keyGeo, keyMat, total);
        keys.castShadow = false;
        keys.receiveShadow = true;
        const m = new THREE.Matrix4();
        let i = 0;
        for (const r of rows) {
            const rowW = r.keys.reduce((a, b) => a + b, 0) * u;
            let x = -rowW / 2;
            for (const k of r.keys) {
                const kw = k * u - 0.03;
                m.compose(new THREE.Vector3(x + (k * u) / 2, 0.076, r.z), new THREE.Quaternion(), new THREE.Vector3(kw, 0.014, r.depth));
                keys.setMatrixAt(i++, m);
                x += k * u;
            }
        }
        this.macbook.add(keys);

        // trackpad
        const pad = mesh(new RoundedBoxGeometry(1.24, 0.004, 0.76, 2, 0.002), std("#38414f", 0.3, 0.7), false, true);
        pad.position.set(0, 0.071, 0.63);
        this.macbook.add(pad);

        // cerniera
        const hinge = mesh(new THREE.CylinderGeometry(0.032, 0.032, 2.5, 20), std("#1b1f26", 0.4, 0.6));
        hinge.rotation.z = Math.PI / 2;
        hinge.position.set(0, 0.06, -1.06);
        this.macbook.add(hinge);

        // coperchio: ruota attorno al bordo posteriore della base
        const LH = 2.12;
        this.lid.position.set(0, 0.07, -1.075);
        const shell = mesh(new RoundedBoxGeometry(W, LH, 0.042, 4, 0.02), midnightMatte);
        shell.position.set(0, LH / 2, -0.021);
        this.lid.add(shell);
        const bezel = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.06, LH - 0.06), std("#050505", 0.25, 0.2));
        bezel.position.set(0, LH / 2, 0.0025);
        this.lid.add(bezel);
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(2.86, 1.86),
            new THREE.MeshBasicMaterial({ map: this.screen.texture, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
        );
        display.position.set(0, LH / 2 + 0.04, 0.007);
        this.lid.add(display);
        this.lid.rotation.x = -0.3; // un po' oltre la verticale
        this.macbook.add(this.lid);

        this.scene.add(this.macbook);
    }

    // ------------------------------------------------------------------
    // Scrivania in rovere con struttura in metallo nero
    // ------------------------------------------------------------------
    private buildDesk() {
        const wood = std("#ffffff", 0.72, 0, { map: woodTexture() });
        const top = mesh(new RoundedBoxGeometry(15, 0.28, 7.4, 3, 0.05), wood);
        top.position.set(0, -0.14, -0.6);
        this.desk.add(top);
        this.desk.position.set(0, 0, 0);
        this.scene.add(this.desk);
        this.appears.push({ node: this.desk, a: 0.02, b: 0.17, kind: "grow", base: new THREE.Vector3(), scale: new THREE.Vector3(1, 1, 1) });

        const metal = std(COLORS.metal, 0.45, 0.6);
        for (const sx of [-1, 1]) {
            for (const z of [-3.9, 2.7]) {
                const post = mesh(new THREE.BoxGeometry(0.12, 7, 0.12), metal);
                post.position.set(sx * 6.9, -3.78, z);
                this.legs.add(post);
            }
            const bar = mesh(new THREE.BoxGeometry(0.12, 0.12, 6.7), metal);
            bar.position.set(sx * 6.9, -0.34, -0.6);
            this.legs.add(bar);
        }
        this.scene.add(this.legs);
        this.appears.push({ node: this.legs, a: 0.1, b: 0.22, kind: "grow", base: new THREE.Vector3(), scale: new THREE.Vector3(1, 1, 1) });

        // tappetino in feltro sotto MacBook e mouse
        const mat = mesh(new RoundedBoxGeometry(6.6, 0.025, 3.7, 2, 0.012), std(COLORS.felt, 0.95), false, true);
        mat.position.set(0.7, 0.0125, 0.35);
        this.add(mat, 0.15, 0.24, "grow");
    }

    private add(node: THREE.Object3D, a: number, b: number, kind: Appear["kind"] = "drop") {
        this.scene.add(node);
        this.appears.push({ node, a, b, kind, base: node.position.clone(), scale: node.scale.clone() });
    }

    // ------------------------------------------------------------------
    // Gli oggetti della postazione
    // ------------------------------------------------------------------
    private buildItems() {
        const { serif, sans } = this.opts.fonts;

        // libri impilati, con la bussola sopra (un ricordo del Nautico)
        const books = new THREE.Group();
        const specs = [
            { w: 2.2, d: 1.6, h: 0.34, c: "#3f4a5a", t: "JAVA" },
            { w: 2.0, d: 1.45, h: 0.3, c: "#c9c3b6", t: "ALGORITMI" },
            { w: 1.85, d: 1.35, h: 0.26, c: "#2b2b2b", t: "BASI DI DATI" },
        ];
        let y = 0;
        specs.forEach((s, i) => {
            const spine = canvasTexture(512, 96, (ctx, w, h) => {
                ctx.fillStyle = s.c;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = i === 1 ? "#2a2a2a" : "#f1efe9";
                ctx.font = `600 44px ${sans}`;
                ctx.textBaseline = "middle";
                ctx.fillText(s.t, 34, h / 2 + 2);
            });
            const cover = std(s.c, 0.7);
            const pages = std(COLORS.paper, 0.9);
            const mats = [pages, pages, cover, cover, std("#ffffff", 0.7, 0, { map: spine }), pages];
            const book = mesh(new THREE.BoxGeometry(s.w, s.h, s.d), mats);
            book.position.set(0, y + s.h / 2, 0);
            book.rotation.y = [0.05, -0.12, 0.18][i];
            books.add(book);
            y += s.h;
        });
        const compass = makeCompass(serif);
        compass.group.position.set(0.1, y, 0.05);
        compass.group.rotation.y = -0.35;
        this.needle = compass.needle;
        books.add(compass.group);
        books.position.set(-4.5, 0, 0.3);
        books.rotation.y = 0.35;
        this.add(books, 0.3, 0.42);

        // pianta in vaso
        const plant = new THREE.Group();
        const potProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.48, 0),
            new THREE.Vector2(0.56, 0.08),
            new THREE.Vector2(0.62, 0.95),
            new THREE.Vector2(0.58, 0.95),
            new THREE.Vector2(0.55, 0.86),
            new THREE.Vector2(0, 0.86),
        ];
        plant.add(mesh(new THREE.LatheGeometry(potProfile, 40), std(COLORS.ceramic, 0.45)));
        const soil = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.02, 32), std(COLORS.soil, 1));
        soil.position.y = 0.86;
        plant.add(soil);
        const leafMat = std(COLORS.leaf, 0.55, 0, { side: THREE.DoubleSide });
        const leafMat2 = std(COLORS.leafDark, 0.6, 0, { side: THREE.DoubleSide });
        const leafGeo = new THREE.SphereGeometry(1, 20, 12);
        let seed = 3;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        for (let k = 0; k < 14; k++) {
            const a = (k / 14) * Math.PI * 2 + rnd() * 0.4;
            const len = 0.9 + rnd() * 1.3;
            const tilt = 0.35 + rnd() * 0.55;
            const stem = new THREE.Group();
            stem.position.y = 0.86;
            stem.rotation.y = a;
            const s = mesh(new THREE.CylinderGeometry(0.018, 0.024, len, 6), leafMat2);
            s.position.set(0, len / 2, 0);
            const arm = new THREE.Group();
            arm.rotation.z = tilt;
            arm.add(s);
            const leaf = mesh(leafGeo, k % 3 ? leafMat : leafMat2);
            leaf.scale.set(0.3 + rnd() * 0.12, 0.025, 0.55 + rnd() * 0.25);
            leaf.position.set(0, len + 0.25, 0);
            leaf.rotation.set(0.5 + rnd() * 0.5, 0, 0);
            arm.add(leaf);
            stem.add(arm);
            plant.add(stem);
        }
        plant.position.set(5.3, 0, -2.5);
        this.add(plant, 0.38, 0.5);

        // tazza di caffè con il vapore
        const mug = new THREE.Group();
        const mugProfile = [
            new THREE.Vector2(0, 0.0),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.42, 0.04),
            new THREE.Vector2(0.44, 0.9),
            new THREE.Vector2(0.4, 0.9),
            new THREE.Vector2(0.38, 0.1),
            new THREE.Vector2(0, 0.1),
        ];
        mug.add(mesh(new THREE.LatheGeometry(mugProfile, 48), std(COLORS.ceramic, 0.25)));
        const handle = mesh(new THREE.TorusGeometry(0.2, 0.045, 12, 32, Math.PI * 1.2), std(COLORS.ceramic, 0.25));
        handle.position.set(0.42, 0.48, 0);
        handle.rotation.z = -Math.PI * 0.6;
        mug.add(handle);
        const coffee = mesh(new THREE.CircleGeometry(0.38, 40), std(COLORS.coffee, 0.15), false, false);
        coffee.rotation.x = -Math.PI / 2;
        coffee.position.y = 0.78;
        mug.add(coffee);
        const steamTex = canvasTexture(64, 256, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, h, 0, 0);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(0.25, "rgba(255,255,255,0.75)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.ellipse(w / 2, h / 2, w / 2.4, h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        for (let k = 0; k < 3; k++) {
            const st = new THREE.Mesh(
                new THREE.PlaneGeometry(0.22, 0.95, 1, 12),
                new THREE.MeshBasicMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0, color: 0xffffff }),
            );
            st.position.set((k - 1) * 0.12, 1.35, 0);
            st.userData.phase = k * 2.1;
            this.steam.push(st);
            mug.add(st);
        }
        mug.position.set(3.9, 0, -0.5);
        mug.rotation.y = -0.6;
        this.add(mug, 0.44, 0.55);

        // quaderno con penna
        const notebook = new THREE.Group();
        const nbCover = mesh(new RoundedBoxGeometry(1.5, 0.07, 2.1, 2, 0.02), std("#242424", 0.75));
        nbCover.position.y = 0.035;
        notebook.add(nbCover);
        const nbPages = mesh(new THREE.BoxGeometry(1.44, 0.04, 2.02), std(COLORS.paper, 0.95));
        nbPages.position.set(0.02, 0.058, 0);
        notebook.add(nbPages);
        const band = mesh(new THREE.BoxGeometry(0.04, 0.076, 2.12), std("#111", 0.5));
        band.position.set(0.5, 0.036, 0);
        notebook.add(band);
        const pen = new THREE.Group();
        const barrel = mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.35, 16), std("#c9c9c9", 0.25, 0.9));
        barrel.rotation.z = Math.PI / 2;
        pen.add(barrel);
        const tip = mesh(new THREE.ConeGeometry(0.035, 0.12, 16), std("#222", 0.3, 0.6));
        tip.rotation.z = -Math.PI / 2;
        tip.position.x = 0.735;
        pen.add(tip);
        pen.position.set(-0.05, 0.11, 0.2);
        pen.rotation.y = 0.7;
        notebook.add(pen);
        notebook.position.set(-2.75, 0, 1.75);
        notebook.rotation.y = 0.32;
        this.add(notebook, 0.5, 0.6);

        // post-it scritti a mano
        const notes: [string, string, number, number, number][] = [
            ["git push\n--force? no.", COLORS.note, 2.35, 2.05, -0.18],
            ["deploy\nvenerdì?\nmai.", COLORS.noteBlue, 3.25, 2.5, 0.22],
            ["caffè n°3", COLORS.note, -1.95, 2.85, 0.4],
        ];
        notes.forEach(([text, color, x, z, r], k) => {
            const tex = canvasTexture(256, 256, (ctx, w, h) => {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "rgba(0,0,0,0.06)";
                ctx.fillRect(0, 0, w, 26);
                ctx.fillStyle = "#1c1c1c";
                ctx.font = `italic 400 54px ${serif}`;
                ctx.textBaseline = "top";
                text.split("\n").forEach((line, li) => ctx.fillText(line, 22, 46 + li * 56));
            });
            const note = mesh(new THREE.BoxGeometry(0.75, 0.008, 0.75), [
                std(color, 0.9),
                std(color, 0.9),
                std("#ffffff", 0.9, 0, { map: tex }),
                std(color, 0.9),
                std(color, 0.9),
                std(color, 0.9),
            ]);
            note.position.set(x, 0.004 + k * 0.001, z);
            note.rotation.y = r;
            this.add(note, 0.56 + k * 0.03, 0.64 + k * 0.03, "pop");
        });

        // mouse
        const mouse = mesh(new THREE.SphereGeometry(1, 40, 24), phys("#f4f4f2", { roughness: 0.2, clearcoat: 0.8 }));
        mouse.scale.set(0.31, 0.11, 0.56);
        mouse.position.set(2.45, 0.025, 0.45);
        mouse.rotation.y = -0.12;
        this.add(mouse, 0.62, 0.7);

        // cuffie appoggiate sul piano
        const phones = new THREE.Group();
        const dark = std("#2a2a2c", 0.55, 0.2);
        const band2 = mesh(new THREE.TorusGeometry(0.72, 0.055, 14, 48, Math.PI), dark);
        band2.rotation.x = -Math.PI / 2;
        band2.position.y = 0.17;
        phones.add(band2);
        for (const s of [-1, 1]) {
            const cup = mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 32), dark);
            cup.position.set(0.72 * s, 0.17, 0);
            cup.rotation.z = Math.PI / 2;
            phones.add(cup);
            const pad = mesh(new THREE.TorusGeometry(0.24, 0.08, 12, 32), std("#3b3b3e", 0.9));
            pad.position.set(0.6 * s, 0.17, 0);
            pad.rotation.y = Math.PI / 2;
            phones.add(pad);
        }
        phones.position.set(5.2, 0, 1.25);
        phones.rotation.y = -0.5;
        this.add(phones, 0.66, 0.75);

        // cavo di ricarica che esce dal lato sinistro
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.53, 0.035, -0.6),
            new THREE.Vector3(-1.95, 0.02, -0.75),
            new THREE.Vector3(-2.35, 0.02, -1.9),
            new THREE.Vector3(-2.7, 0.02, -3.6),
            new THREE.Vector3(-2.8, -0.05, -4.25),
            new THREE.Vector3(-2.82, -1.6, -4.32),
        ]);
        const cable = mesh(new THREE.TubeGeometry(curve, 120, 0.02, 8, false), std("#efefef", 0.5));
        this.add(cable, 0.7, 0.78, "pop");
    }

    private buildLamp() {
        const g = new THREE.Group();
        const white = std("#f1f1ef", 0.42, 0.1);
        const black = std("#202020", 0.4, 0.5);
        const base = mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.1, 40), white);
        base.position.y = 0.05;
        g.add(base);

        const lower = new THREE.Group();
        lower.position.y = 0.1;
        lower.rotation.z = -0.32;
        lower.rotation.x = 0.1;
        const arm1 = mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.6, 12), white);
        arm1.position.y = 1.3;
        lower.add(arm1);
        const joint = mesh(new THREE.SphereGeometry(0.09, 16, 12), black);
        joint.position.y = 2.6;
        lower.add(joint);
        const upper = new THREE.Group();
        upper.position.y = 2.6;
        upper.rotation.z = 1.85;
        const arm2 = mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12), white);
        arm2.position.y = 1.1;
        upper.add(arm2);
        const head = new THREE.Group();
        head.position.y = 2.2;
        head.rotation.z = 0.9;
        const shade = mesh(
            new THREE.CylinderGeometry(0.16, 0.48, 0.62, 40, 1, true),
            std("#f1f1ef", 0.42, 0.1, { side: THREE.DoubleSide }),
        );
        shade.position.y = -0.26;
        head.add(shade);
        const bulb = std("#fff3d6", 0.3, 0, { emissive: new THREE.Color("#ffd28a"), emissiveIntensity: 0 });
        const bulbMesh = mesh(new THREE.SphereGeometry(0.13, 20, 14), bulb, false, false);
        bulbMesh.position.y = -0.36;
        head.add(bulbMesh);
        upper.add(head);
        lower.add(upper);
        g.add(lower);

        g.position.set(-4.4, 0, -2.75);
        g.rotation.y = -0.65;
        this.add(g, 0.24, 0.36);

        const light = new THREE.SpotLight(0xffc77a, 0, 12, 0.75, 0.6, 1.6);
        light.position.set(-3.4, 3.9, -1.9);
        light.target.position.set(-1.2, 0, 0.2);
        light.castShadow = false;
        this.scene.add(light, light.target);
        return { light, bulb };
    }

    // ------------------------------------------------------------------
    // Aggiornamento
    // ------------------------------------------------------------------
    setSize(w: number, h: number) {
        this.width = Math.max(1, w);
        this.height = Math.max(1, h);
        this.renderer.setSize(this.width, this.height, false);
        this.camera.aspect = this.width / this.height;
        this.apply();
    }

    setIntro(t: number) {
        this.intro = clamp01(t);
        this.apply();
    }

    setProgress(p: number) {
        this.progress = clamp01(p);
        this.apply();
    }

    /** Riquadro del MacBook sullo schermo, in pixel CSS (serve ai controlli automatici). */
    macbookScreenBox() {
        const box = new THREE.Box3().setFromObject(this.macbook);
        const pts = [box.min.x, box.max.x].flatMap((x) =>
            [box.min.y, box.max.y].flatMap((y) => [box.min.z, box.max.z].map((z) => new THREE.Vector3(x, y, z).project(this.camera))),
        );
        const xs = pts.map((v) => ((v.x + 1) / 2) * this.width);
        const ys = pts.map((v) => ((1 - v.y) / 2) * this.height);
        return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
    }

    /** Il riquadro della pagina in cui deve stare il MacBook all'inizio (frazioni della finestra). */
    setHeroFrame(frame: { cx: number; cy: number; w: number; h: number }) {
        this.hero = frame;
        this.apply();
    }

    quack() {
        this.quackT = this.elapsed();
    }

    setTheme(theme: "light" | "dark") {
        const dark = theme === "dark";
        this.fog.color.set(dark ? 0x0e0e0e : 0xf1f1f1);
        this.hemi.intensity = dark ? 0.45 : 0.9;
        this.hemi.groundColor.set(dark ? 0x1a1a1a : 0xcfcfcf);
        this.sun.intensity = dark ? 1.4 : 2.1;
        this.scene.environmentIntensity = dark ? 0.32 : 0.55;
        (this.blob.material as THREE.MeshBasicMaterial).opacity = dark ? 0.9 : 1;
        this.render();
    }

    /** Quanto allontanare la camera perché ogni fase stia bene in questa finestra. */
    private fit() {
        const aspect = this.width / this.height;
        const tanH = Math.tan(THREE.MathUtils.degToRad(15)); // metà del campo visivo verticale (30°)
        const mobile = this.width <= 760 || aspect < 1;
        const dist = (p: Pose) => p.pos.distanceTo(p.target);
        // intro: lo schermo (2,86 di larghezza) riempie quasi tutta la finestra
        const dIntro = Math.max(dist(this.poses.intro), 2.86 / (0.92 * 2 * tanH * aspect), 1.86 / (0.82 * 2 * tanH));
        // hero: il MacBook largo come la colonna centrale (sul telefono, due terzi dello schermo)
        // hero: il MacBook sta dentro il riquadro libero lasciato dai testi (misurato nella pagina)
        const fw = Math.max(0.12, this.hero.w * 0.88);
        const fh = Math.max(0.12, this.hero.h * 0.86);
        const dHero = Math.max(3.04 / (fw * 2 * tanH * aspect), 2.45 / (fh * 2 * tanH));
        // scrivania: circa 12,5 unità di larghezza nell'inquadratura
        const dDesk = Math.max(dist(this.poses.final), (this.width <= 760 ? 7.6 : aspect < 1 ? 9.5 : 12.5) / (2 * tanH * aspect));
        return {
            intro: dIntro / dist(this.poses.intro),
            hero: dHero / dist(this.poses.hero),
            build: Math.max(dHero / dist(this.poses.hero), dDesk / dist(this.poses.final)) * 0.92,
            final: dDesk / dist(this.poses.final),
            mobile,
        };
    }

    private cameraPose(): Pose & { k: number; shiftX: number } {
        const p = this.progress;
        const { intro, hero, build, final } = this.poses;
        const k = this.fit();
        let a: Pose;
        let b: Pose;
        let ka: number;
        let kb: number;
        let t: number;
        if (this.intro < 1) {
            a = intro;
            b = hero;
            ka = k.intro;
            kb = k.hero;
            t = easeInOut(remap(this.intro, 0.42, 1));
        } else if (p < 0.45) {
            a = hero;
            b = build;
            ka = k.hero;
            kb = k.build;
            t = easeInOut(remap(p, 0.0, 0.45));
        } else {
            a = build;
            b = final;
            ka = k.build;
            kb = k.final;
            t = easeInOut(remap(p, 0.45, 0.85));
        }
        const heroShift = this.hero.cy - 0.5;
        const shiftOf = (x: Pose) => (x === hero ? heroShift : x.shift);
        return {
            pos: a.pos.clone().lerp(b.pos, t),
            target: a.target.clone().lerp(b.target, t),
            shift: shiftOf(a) + (shiftOf(b) - shiftOf(a)) * t,
            shiftX: (a === hero ? this.hero.cx - 0.5 : 0) + ((b === hero ? this.hero.cx - 0.5 : 0) - (a === hero ? this.hero.cx - 0.5 : 0)) * t,
            k: ka + (kb - ka) * t,
        };
    }

    private apply() {
        const p = this.progress;

        // camera, allontanata sugli schermi stretti perché tutto resti nell'inquadratura
        const cp = this.cameraPose();
        const dir = cp.pos.clone().sub(cp.target).multiplyScalar(cp.k);
        this.camera.position.copy(cp.target).add(dir);
        this.camera.lookAt(cp.target);
        this.camera.setViewOffset(this.width, this.height, -cp.shiftX * this.width, -cp.shift * this.height, this.width, this.height);
        this.camera.updateProjectionMatrix();
        // la nebbia segue la distanza della camera: gli oggetti lontani sfumano nel colore della pagina
        const camDist = dir.length();
        this.fog.near = camDist * 1.05;
        this.fog.far = camDist * 2.3;

        // oggetti che arrivano
        for (const it of this.appears) {
            const t = remap(p, it.a, it.b);
            it.node.visible = t > 0.001;
            if (!it.node.visible) continue;
            if (it.kind === "grow") {
                const e = Math.max(0.001, easeOutCubic(t));
                it.node.scale.set(it.scale.x * e, it.scale.y * (it.node === this.legs ? e : 1), it.scale.z * e);
            } else if (it.kind === "pop") {
                const e = Math.max(0.001, easeOutBack(t));
                it.node.scale.copy(it.scale).multiplyScalar(e);
                it.node.position.copy(it.base);
            } else {
                const e = easeOutBack(t);
                const lift = (1 - easeOutCubic(t)) * 2.2;
                it.node.position.set(it.base.x, it.base.y + lift, it.base.z);
                it.node.scale.copy(it.scale).multiplyScalar(0.55 + 0.45 * Math.min(1, e));
            }
        }

        // l'ombra morbida lascia il posto a quella vera quando c'è la scrivania
        (this.blob.material as THREE.MeshBasicMaterial).opacity = 1 - remap(p, 0.04, 0.16);

        // lampada che si accende alla fine
        const on = remap(p, 0.74, 0.84);
        this.lampLight.intensity = on * 26;
        this.lampBulb.emissiveIntensity = on * 3;
        this.screenGlow.intensity = 0.6 + 0.6 * remap(p, 0.1, 0.4);

        // lo schermo: "ciao" nell'intro, poi il codice che si scrive con lo scroll
        if (p < 0.1) {
            this.screen.draw({ mode: "ciao", reveal: remap(this.intro, 0.08, 0.4), chars: 0, caret: false });
        } else {
            const chars = Math.round(remap(p, 0.12, 0.66) * CODE_LENGTH);
            const blink = Math.floor(this.elapsed() * 2) % 2 === 0;
            this.screen.draw({ mode: "code", reveal: 1, chars, caret: chars < CODE_LENGTH || blink });
        }
        if (!this.running) this.render();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }

    private tick = () => {
        if (!this.running) return;
        const time = this.elapsed();
        // vapore della tazza
        for (const st of this.steam) {
            const ph = (time * 0.5 + st.userData.phase) % 3;
            const life = ph / 3;
            st.position.y = 1.05 + life * 0.9;
            st.scale.x = 0.7 + life * 0.8;
            st.rotation.y = Math.sin(time + st.userData.phase) * 0.5;
            (st.material as THREE.MeshBasicMaterial).opacity = Math.sin(life * Math.PI) * 0.55 * remap(this.progress, 0.5, 0.6);
            st.lookAt(this.camera.position.x, st.getWorldPosition(new THREE.Vector3()).y, this.camera.position.z);
        }
        // l'ago della bussola oscilla appena; col Konami code fa un giro completo
        if (this.needle) {
            const q = time - this.quackT;
            const spin = q >= 0 && q < 1.6 ? easeOutCubic(q / 1.6) * Math.PI * 4 : 0;
            this.needle.rotation.y = Math.sin(time * 0.9) * 0.08 + Math.sin(time * 2.3) * 0.03 + spin;
        }
        // e la lampada lampeggia
        const q2 = time - this.quackT;
        if (q2 >= 0 && q2 < 1.4) {
            const on = remap(this.progress, 0.74, 0.84);
            const flick = Math.sin(q2 * 40) > 0 ? 1 : 0.15;
            this.lampLight.intensity = Math.max(on, 0.6) * 26 * flick;
            this.lampBulb.emissiveIntensity = Math.max(on, 0.6) * 3 * flick;
        } else if (q2 >= 1.4 && q2 < 1.6) {
            const on = remap(this.progress, 0.74, 0.84);
            this.lampLight.intensity = on * 26;
            this.lampBulb.emissiveIntensity = on * 3;
        }
        // cursore che lampeggia
        if (this.progress >= 0.1) {
            const chars = Math.round(remap(this.progress, 0.12, 0.66) * CODE_LENGTH);
            const blink = Math.floor(time * 2) % 2 === 0;
            this.screen.draw({ mode: "code", reveal: 1, chars, caret: chars < CODE_LENGTH || blink });
        }
        this.render();
        this.raf = requestAnimationFrame(this.tick);
    };

    start() {
        if (this.running) return;
        this.running = true;
        this.raf = requestAnimationFrame(this.tick);
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.raf);
    }

    dispose() {
        this.stop();
        this.scene.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.geometry) m.geometry.dispose();
            const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
            for (const mat of mats) {
                for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
                mat.dispose();
            }
        });
        this.envTex.dispose();
        this.renderer.dispose();
    }
}

export { roundRect };
