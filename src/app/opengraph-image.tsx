import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogPicture } from "@/lib/og";

export const alt = "Dario Elia, sviluppatore full-stack junior: il logotipo dario.elia e un MacBook che dice ciao";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
    const [fonts, macbook] = await Promise.all([ogFonts(), ogPicture("macbook")]);
    return new ImageResponse(
        <OgCard side={["Studente di Informatica", "@ Unical · Calabria"]} foot="darioelia.it" visual={{ kind: "macbook", src: macbook }} />,
        { ...size, fonts },
    );
}
