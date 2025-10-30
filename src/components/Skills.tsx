"use client";

import { motion } from "framer-motion";
import SkillCard from "./SkillCard";
import { FaReact, FaGit, FaJava, FaGithub } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiFramer, SiJavascript } from "react-icons/si";

const skills = [
  { name: "React", icon: <FaReact />, description: "Criação de interfaces dinâmicas com hooks e componentes reutilizáveis." },
  { name: "TypeScript", icon: <SiTypescript />, description: "Código mais seguro e escalável com tipagem estática e interfaces." },
  { name: "Next.js", icon: <SiNextdotjs />, description: "SSR, SSG e ótima performance para projetos modernos e otimizados." },
  { name: "TailwindCSS", icon: <SiTailwindcss />, description: "Estilização ágil e responsiva com classes utilitárias." },
  { name: "Framer Motion", icon: <SiFramer />, description: "Animações suaves e interativas para interfaces modernas." },
  { name: "Git", icon: <FaGit />, description: "Controle de versão e colaboração eficiente em projetos." },
  { name: "JavaScript", icon: <SiJavascript />, description: "Programação front-end e lógica dinâmica para web." },
  { name: "Java", icon: <FaJava />, description: "Programação back-end e lógica robusta de aplicações." },
  { name: "GitHub", icon: <FaGithub />, description: "Repositórios, versionamento e deploy contínuo." },
];

export default function Skills() {
  return (
    <section className="py-20 px-10 bg-neutral-950">
      <motion.h2
        className="text-3xl font-bold mb-12 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Habilidades
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
          >
            <SkillCard {...skill} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
