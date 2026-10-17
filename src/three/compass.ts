import * as THREE from "three";
import { COLORS, canvasTexture, mesh, phys, std } from "./materials";

/**
 * Bussola da tavolo in ottone (un ricordo del Nautico). Raggio circa 0.45 (4,5 cm),
 * base sul piano y = 0. L'ago è un oggetto a parte: `needle.rotation.y` lo orienta.
 */
export function makeCompass(serif: string) {
    const g = new THREE.Group();
    g.name = "bussola";
    const brass = std(COLORS.brass, 0.32, 0.85);
    const body = mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.16, 48), brass);
    body.position.y = 0.08;
    g.add(body);
    const rim = mesh(new THREE.TorusGeometry(0.4, 0.03, 12, 48), brass);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.165;
    g.add(rim);

    const dial = canvasTexture(512, 512, (ctx, w, h) => {
        ctx.fillStyle = "#f2efe6";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.translate(w / 2, h / 2);
        for (let k = 0; k < 72; k++) {
            ctx.rotate((Math.PI * 2) / 72);
            ctx.fillStyle = "#2a2a2a";
            ctx.fillRect(-1.5, -w / 2 + 18, 3, k % 6 === 5 ? 34 : 16);
        }
        ctx.font = `italic 400 84px ${serif}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ["N", "E", "S", "O"].forEach((t, k) => {
            ctx.save();
            ctx.rotate((k * Math.PI) / 2);
            ctx.fillStyle = k === 0 ? "#b4322a" : "#2a2a2a";
            ctx.fillText(t, 0, -w / 2 + 110);
            ctx.restore();
        });
        void h;
    });
    const face = mesh(new THREE.CircleGeometry(0.36, 48), std("#ffffff", 0.5, 0, { map: dial }), false, true);
    face.rotation.x = -Math.PI / 2;
    face.position.y = 0.161;
    g.add(face);

    // ago: metà rossa verso nord, metà scura verso sud
    const needle = new THREE.Group();
    needle.position.y = 0.172;
    const half = (color: string, dir: 1 | -1) => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.27 * dir);
        shape.lineTo(0.035, 0);
        shape.lineTo(-0.035, 0);
        shape.closePath();
        const m = mesh(new THREE.ShapeGeometry(shape), std(color, 0.4, 0.2, { side: THREE.DoubleSide }), false, false);
        m.rotation.x = -Math.PI / 2;
        return m;
    };
    needle.add(half("#b4322a", 1), half("#3a3a3a", -1));
    const pin = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16), brass, false, false);
    needle.add(pin);
    g.add(needle);

    const glass = new THREE.Mesh(
        new THREE.SphereGeometry(0.37, 32, 12, 0, Math.PI * 2, 0, 0.5),
        phys("#ffffff", { roughness: 0.05, transmission: 0.9, thickness: 0.05, transparent: true, opacity: 0.3 }),
    );
    glass.scale.y = 0.35;
    glass.position.y = 0.16;
    g.add(glass);

    return { group: g, needle };
}
