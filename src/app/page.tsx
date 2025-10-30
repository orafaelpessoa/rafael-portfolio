import Hero from "../components/Hero";
import AboutMe from "../components/AboutMe";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";

export default function Page() {
  return (
    <main className="flex flex-col bg-black text-white">
      <Hero />
      <AboutMe />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
