import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import DataCleaningReport from "@/components/DataCleaningReport";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProjects } from "@/lib/api";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Skills projects={projects} />
        <About />
        <Experience />
        <Projects projects={projects} />
        <DataCleaningReport />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
