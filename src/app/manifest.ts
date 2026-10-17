import type { MetadataRoute } from "next";
import { config } from "@/data/config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: config.title,
        short_name: config.author,
        description: config.description.short,
        start_url: "/",
        display: "standalone",
        background_color: "#f1f1f1",
        theme_color: "#f1f1f1",
        icons: [
            { src: "/icon", sizes: "512x512", type: "image/png" },
            { src: "/apple-icon", sizes: "180x180", type: "image/png" },
        ],
    };
}
