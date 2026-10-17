import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogPicture } from "@/lib/og";

export const alt = "Curriculum di Dario Elia, sviluppatore full-stack junior";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CvOpengraphImage() {
    const [fonts, photo] = await Promise.all([ogFonts(), ogPicture("foto")]);
    return new ImageResponse(
        <OgCard title="curriculum" side={["Dario Elia", "Full-stack junior", "Informatica @ Unical"]} foot="darioelia.it/cv" visual={{ kind: "photo", src: photo }} />,
        { ...size, fonts },
    );
}
