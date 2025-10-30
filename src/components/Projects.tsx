"use client";

import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const projectsToShow = showAll ? projects : projects.slice(0, 6);

  if (!projects.length) return null;

  return (
    <section className="py-20 px-10 bg-neutral-900">
      <motion.h2
        className="text-3xl font-bold mb-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Projetos
      </motion.h2>

      <motion.div
        className="text-center text-2xl font-semibold text-purple-500 mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      >
        Projetos feitos: <CountUp end={projects.length} duration={1.5} />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {projectsToShow.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>

      {!showAll && projects.length > 6 && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
          >
            Ver mais
          </button>
        </motion.div>
      )}
    </section>
  );
}
