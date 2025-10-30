"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="py-20 px-10 bg-neutral-950 flex flex-col items-center">
      <motion.h2
        className="text-3xl font-bold mb-10 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Contato
      </motion.h2>

      <motion.p
        className="text-center text-gray-300 max-w-xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Gostou do meu trabalho ou quer bater um papo sobre algum projeto? 
        Me mande uma mensagem e vamos conversar!
      </motion.p>

      <motion.a
        href="mailto:rafaelpessoa@example.com"
        className="relative inline-block px-8 py-3 font-semibold text-lg text-white rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 35px rgba(168,85,247,0.7)",
          rotateX: 8,
          rotateY: -8,
        }}
        whileTap={{ scale: 0.95 }}
      >
        Enviar mensagem
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-purple-600 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    </section>
  );
}
