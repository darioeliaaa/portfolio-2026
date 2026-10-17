import * as THREE from "three";

/** Colori e materiali della postazione. Unità: 1 = 10 cm. */
export const COLORS = {
    midnight: "#2f3744", // MacBook Air M4, finitura Midnight
    keys: "#0c0d10",
    oak: "#cdbfa9",
    oakDark: "#b7a78f",
    metal: "#1d1d1f",
    ceramic: "#f3f2ef",
    paper: "#f7f5f0",
    felt: "#3b3d40",
    leaf: "#6f8b62",
    leafDark: "#566f4c",
    soil: "#3a2e26",
    coffee: "#3b2618",
    brass: "#b8a06e",
    note: "#f3e7a0",
    noteBlue: "#cfe3ef",
};

export const std = (color: string, roughness = 0.6, metalness = 0, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

export const phys = (color: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
    new THREE.MeshPhysicalMaterial({ color, ...extra });

/** Mesh che proietta e riceve ombre. */
export function mesh(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], cast = true, receive = true) {
    const m = new THREE.Mesh(geometry, material);
    m.castShadow = cast;
    m.receiveShadow = receive;
    return m;
}

/** Texture disegnata su un canvas 2D. */
export function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    draw(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
}

/** Venatura leggera per il piano in rovere. */
export function woodTexture() {
    const tex = canvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = COLORS.oak;
        ctx.fillRect(0, 0, w, h);
        let seed = 7;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        for (let i = 0; i < 140; i++) {
            const y = rnd() * h;
            const amp = 2 + rnd() * 7;
            const freq = 0.004 + rnd() * 0.01;
            ctx.strokeStyle = `rgba(120, 96, 66, ${0.05 + rnd() * 0.09})`;
            ctx.lineWidth = 0.6 + rnd() * 1.8;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 8) {
                const yy = y + Math.sin(x * freq + i) * amp + Math.sin(x * freq * 3.1) * amp * 0.3;
                if (x === 0) ctx.moveTo(x, yy);
                else ctx.lineTo(x, yy);
            }
            ctx.stroke();
        }
    });
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.4, 1);
    return tex;
}

/** Ombra morbida a disco, usata quando sotto non c'è ancora la scrivania. */
export function blobShadowTexture() {
    return canvasTexture(256, 256, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        g.addColorStop(0, "rgba(0,0,0,0.42)");
        g.addColorStop(0.55, "rgba(0,0,0,0.16)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    });
}
