import { ImageResponse } from "next/og";
import { OgCard, ogFonts } from "@/lib/og";

export const alt = "Curriculum di Dario Elia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CvOpengraphImage() {
    return new ImageResponse(<OgCard title="curriculum" subtitle="Dario Elia · sviluppatore full-stack junior" />, { ...size, fonts: await ogFonts() });
}
