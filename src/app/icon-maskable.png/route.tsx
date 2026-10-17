import { ImageResponse } from "next/og";
import { IconArt, ogFonts } from "@/lib/og";

export const dynamic = "force-static";

/**
 * Icona "maskable" per Android: il launcher la ritaglia a cerchio o a goccia,
 * quindi la lettera sta tutta nel cerchio centrale (l'80% del lato).
 */
export async function GET() {
    return new ImageResponse(<IconArt size={512} glyph={0.58} />, { width: 512, height: 512, fonts: await ogFonts() });
}
