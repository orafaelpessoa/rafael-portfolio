"use client";

import { motion } from "framer-motion";

export default function AboutMe() {
  const textVariant = {
    hidden: { opacity: 0, y: 10 },
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

  return (
    <section
      id="about"
      className="py-20 px-10 bg-neutral-900 flex flex-col md:flex-row items-center gap-10 overflow-hidden"
    >
      <motion.div
        className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0 border-4 border-purple-600 shadow-[0_0_25px_rgba(168,85,247,0.3)]"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168,85,247,0.6)" }}
        viewport={{ once: true }}
      >
        <img
          src="/me.jpg"
          alt="Rafael Pessoa"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Texto com animações suaves */}
      <motion.div
        className="flex-1 text-white space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          custom={0}
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl font-bold text-purple-400"
        >
          Sobre mim
        </motion.h2>

        <motion.p
          custom={1}
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-lg leading-relaxed text-gray-200"
        >
          Olá! Sou <span className="font-semibold text-white">Rafael Pessoa</span>, desenvolvedor web apaixonado por
          criar interfaces modernas e animadas.
        </motion.p>

        <motion.p
          custom={2}
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-lg leading-relaxed text-gray-300"
        >
          Trabalho com tecnologias como{" "}
          <span className="text-purple-400 font-medium">React, Next.js, TailwindCSS e TypeScript</span> para desenvolver
          experiências digitais fluidas e responsivas.
        </motion.p>

        <motion.p
          custom={3}
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-lg leading-relaxed text-gray-400"
        >
          Meu foco é unir design e performance para entregar projetos que realmente encantem o usuário.
        </motion.p>

        {/* Botão animado */}
        <motion.div custom={4} variants={textVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="pt-6">
          <motion.a
            href="#contact"
            className="relative inline-block px-8 py-3 font-semibold text-lg text-white rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 35px rgba(168,85,247,0.7)",
              rotateX: 8,
              rotateY: -8,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Vamos trabalhar juntos?</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-purple-600 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
