import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import DataCleaningReport from "@/components/DataCleaningReport";
import SalesDashboardTeaser from "@/components/SalesDashboardTeaser";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getProjects } from "@/lib/api";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main>
        {/* Hero renders immediately, no entrance delay - everything below it
            fades in as the visitor scrolls to it (see components/Reveal.tsx). */}
        <Hero />
        <Reveal>
          <Skills projects={projects} />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Projects projects={projects} />
        </Reveal>
        <Reveal>
          <DataCleaningReport />
        </Reveal>
        <Reveal>
          <SalesDashboardTeaser />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
