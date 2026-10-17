import type { MetadataRoute } from "next";
import { config, indexable } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
    // le anteprime di Vercel (i link provvisori dei branch) restano fuori da Google
    if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${config.site}/sitemap.xml`,
        host: config.site,
    };
}
