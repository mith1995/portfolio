import { getProjects } from "../api";
import useApi from "../useApi.js";
import About from "../sections/About.jsx";
import Contact from "../sections/Contact.jsx";
import Experience from "../sections/Experience.jsx";
import Hero from "../sections/Hero.jsx";
import Hire from "../sections/Hire.jsx";
import Projects from "../sections/Projects.jsx";
import Skills from "../sections/Skills.jsx";

export default function Home() {
  const { data, error, loading } = useApi(getProjects, []);
  const projects = data ?? [];

  return (
    <main>
      <Hero projectCount={projects.length} />
      <About />
      <Skills />
      <Projects projects={projects} loading={loading} error={error} />
      <Experience />
      <Hire />
      <Contact />
    </main>
  );
}
