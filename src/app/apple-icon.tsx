import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141414", color: "#f1f1f1" }}>
                <span style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 140, lineHeight: 1, marginTop: -14 }}>d</span>
                <span style={{ fontFamily: "Sans", fontSize: 140, lineHeight: 1, marginTop: -14 }}>.</span>
            </div>
        ),
        { ...size, fonts: await ogFonts() },
    );
}
