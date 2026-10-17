"use client";

import { useEffect, useRef } from "react";

/** La bussola della scrivania, in un riquadro "bussola.obj": l'ago segue il puntatore. */
export default function CompassObject() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let disposed = false;
        let stop = () => {};
        const canvas = canvasRef.current!;
        const io = new IntersectionObserver(async ([e]) => {
            if (!e.isIntersecting || disposed) return;
            io.disconnect();
            const THREE = await import("three");
            const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
            const { makeCompass } = await import("@/three/compass");
            if (disposed) return;
            const serif = getComputedStyle(document.documentElement).getPropertyValue("--font-instrument").trim() || "Georgia, serif";
            await document.fonts.load(`italic 84px ${serif}`).catch(() => undefined);

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.95;
            const scene = new THREE.Scene();
            const pmrem = new THREE.PMREMGenerator(renderer);
            scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
            scene.environmentIntensity = 0.7;
            scene.add(new THREE.HemisphereLight(0xffffff, 0x9a9a9a, 0.7));
            const key = new THREE.DirectionalLight(0xffffff, 1.8);
            key.position.set(-1.5, 3, 2);
            scene.add(key);
            const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
            camera.position.set(0, 1.55, 1.05);
            camera.lookAt(0, 0.08, 0);
            const { group, needle } = makeCompass(serif);
            scene.add(group);

            const size = () => {
                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            };
            size();
            const ro = new ResizeObserver(size);
            ro.observe(canvas);

            // dove punta l'ago: verso il puntatore, se c'è
            let target: number | null = null;
            const onMove = (ev: PointerEvent) => {
                if (ev.pointerType === "touch") return;
                const r = canvas.getBoundingClientRect();
                const dx = ev.clientX - (r.left + r.width / 2);
                const dy = ev.clientY - (r.top + r.height / 2);
                target = -Math.atan2(dx, -dy);
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            let spinAt = -10;
            const onSpin = () => (spinAt = performance.now() / 1000);
            window.addEventListener("quack", onSpin);

            let angle = 0;
            let raf = 0;
            let running = true;
            const vis = new IntersectionObserver(([v]) => {
                running = v.isIntersecting;
                if (running) raf = requestAnimationFrame(loop);
            });
            vis.observe(canvas);
            const loop = (t: number) => {
                if (!running) return;
                const s = t / 1000;
                const goal = target ?? Math.sin(s * 0.7) * 0.25;
                let d = goal - angle;
                d = Math.atan2(Math.sin(d), Math.cos(d)); // la via più breve
                angle += d * 0.08;
                const q = s - spinAt;
                const spin = q >= 0 && q < 1.6 ? (1 - Math.pow(1 - q / 1.6, 3)) * Math.PI * 4 : 0;
                needle.rotation.y = angle + Math.sin(s * 3.1) * 0.015 + spin;
                group.rotation.y = Math.sin(s * 0.25) * 0.08;
                renderer.render(scene, camera);
                raf = requestAnimationFrame(loop);
            };
            raf = requestAnimationFrame(loop);
            stop = () => {
                running = false;
                cancelAnimationFrame(raf);
                ro.disconnect();
                vis.disconnect();
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("quack", onSpin);
                renderer.dispose();
            };
        });
        io.observe(canvas);
        return () => {
            disposed = true;
            io.disconnect();
            stop();
        };
    }, []);

    return (
        <figure className="objframe">
            <span className="objtag mono">bussola.obj</span>
            <span className="objframe__handle objframe__handle--tl" aria-hidden />
            <span className="objframe__handle objframe__handle--tr" aria-hidden />
            <span className="objframe__handle objframe__handle--bl" aria-hidden />
            <span className="objframe__handle objframe__handle--br" aria-hidden />
            <canvas ref={canvasRef} className="objframe__canvas" aria-hidden />
            <figcaption className="objframe__cap mono">Un ricordo del Nautico</figcaption>
        </figure>
    );
}
