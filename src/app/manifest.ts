import type { MetadataRoute } from "next";
import { config } from "@/data/config";

/** Il sito "installato": nome e icona che compaiono sulla schermata Home. */
export default function manifest(): MetadataRoute.Manifest {
    return {
        id: "/",
        name: `${config.author} — Full-Stack Developer`,
        short_name: config.author,
        description: config.description.meta,
        lang: "it",
        dir: "ltr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f1f1f1",
        theme_color: "#f1f1f1",
        categories: ["portfolio", "developer"],
        icons: [
            { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };
}
