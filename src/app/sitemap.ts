import type { MetadataRoute } from "next";
import { config } from "@/data/config";

export default function sitemap(): MetadataRoute.Sitemap {
    // la data dell'ultima pubblicazione: dice a Google quando ripassare
    const lastModified = new Date();
    return [
        { url: config.site, lastModified, changeFrequency: "monthly", priority: 1 },
        { url: `${config.site}/cv`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ];
}
