import { ImageResponse } from "next/og";
import { IconArt, ogFonts } from "@/lib/og";

const SIZES = [32, 192, 512];

/** Icone della scheda del browser e dell'app installata (Android, Chrome). */
export function generateImageMetadata() {
    return SIZES.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType: "image/png" }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
    const s = Number(await id);
    return new ImageResponse(<IconArt size={s} glyph={s <= 32 ? 0.9 : 0.78} radius={0.22} />, {
        width: s,
        height: s,
        fonts: await ogFonts(),
    });
}
