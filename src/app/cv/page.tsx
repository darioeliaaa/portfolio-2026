import type { Metadata } from "next";
import { config } from "@/data/config";
import CvView from "./cv-view";
import "./cv.css";

const cvDescription = `Curriculum di ${config.author} — ${config.role}. Formazione, esperienze, competenze e progetti.`;

export const metadata: Metadata = {
    title: "Curriculum",
    description: cvDescription,
    alternates: { canonical: "/cv" },
    openGraph: {
        title: `Curriculum — ${config.author}`,
        description: cvDescription,
        url: `${config.site}/cv`,
        siteName: config.author,
        locale: "it_IT",
        type: "profile",
        firstName: "Dario",
        lastName: "Elia",
    },
    twitter: {
        card: "summary_large_image",
        title: `Curriculum — ${config.author}`,
        description: cvDescription,
    },
};

export default function CvPage() {
    return <CvView />;
}
