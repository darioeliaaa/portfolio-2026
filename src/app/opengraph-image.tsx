import { ImageResponse } from "next/og";
import { OgCard, ogFonts } from "@/lib/og";

export const alt = "Dario Elia — sviluppatore full-stack junior";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
    return new ImageResponse(<OgCard subtitle="Studente di Informatica @ Unical · Calabria" />, { ...size, fonts: await ogFonts() });
}
