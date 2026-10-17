import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Icona: una "d" corsiva col punto, su carta grigia. */
export default async function Icon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141414", color: "#f1f1f1", borderRadius: 96 }}>
                <span style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 400, lineHeight: 1, marginTop: -40 }}>d</span>
                <span style={{ fontFamily: "Sans", fontSize: 400, lineHeight: 1, marginTop: -40 }}>.</span>
            </div>
        ),
        { ...size, fonts: await ogFonts() },
    );
}
