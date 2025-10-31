"use client";

import { motion } from "framer-motion";

export default function AboutMe() {
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="py-20 px-10 bg-black flex flex-col md:flex-row items-center gap-10 overflow-hidden"
    >
      {/* Foto com animação e brilho pulsante */}
      <motion.div
        className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shrink-0 border-4 border-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse-slow"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(168,85,247,0.8)" }}
        viewport={{ once: true }}
      >
        <img
          src="/icons/images/profile.jpg"
          alt="Rafael Pessoa"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Texto */}
      <motion.div
        className="flex-1 text-white space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          custom={0}
          variants={textVariant}
          className="text-4xl font-bold text-purple-400"
        >
          Sobre mim
        </motion.h2>

        <motion.p
          custom={1}
          variants={textVariant}
          className="text-lg leading-relaxed text-gray-200"
        >
          Olá! Sou <span className="font-semibold text-white">Rafael Pessoa</span>, desenvolvedor web apaixonado por
          criar interfaces modernas e animadas.
        </motion.p>

        <motion.p
          custom={2}
          variants={textVariant}
          className="text-lg leading-relaxed text-gray-300"
        >
          Trabalho com tecnologias como{" "}
          <span className="text-purple-400 font-medium">React, Next.js, TailwindCSS e TypeScript</span> para desenvolver
          experiências digitais fluidas e responsivas.
        </motion.p>

        <motion.p
          custom={3}
          variants={textVariant}
          className="text-lg leading-relaxed text-gray-400"
        >
          Meu foco é unir design e performance para entregar projetos que realmente encantem o usuário.
        </motion.p>
      </motion.div>
    </section>
  );
}
