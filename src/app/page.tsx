import Stage from "@/components/stage";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import CircleReveal from "@/components/circle-reveal";
import About from "@/components/about";
import Pricing from "@/components/pricing";
import Contact from "@/components/contact";

export default function Home() {
    return (
        <>
            <Stage />
            <Skills />
            <CircleReveal mode="in" />
            <Projects />
            <CircleReveal mode="out" />
            <About />
            <Pricing />
            <Contact />
        </>
    );
}
