import { ImageResponse } from "next/og";
import { IconArt, ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icona per "Aggiungi a Home" su iPhone e iPad: piena fino ai bordi, gli angoli li arrotonda iOS. */
export default async function AppleIcon() {
    return new ImageResponse(<IconArt size={180} glyph={0.74} />, { ...size, fonts: await ogFonts() });
}
