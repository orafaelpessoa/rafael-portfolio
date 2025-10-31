"use client";

import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  const whatsappLink = `https://wa.me/83988539348?text=${encodeURIComponent(
    "Olá, vi seu portfólio e gostaria de conversar sobre um projeto!"
  )}`;

  const emailLink = `mailto:rafael.pessoa.alexandre@gmail.com?subject=${encodeURIComponent(
    "Contato pelo portfólio"
  )}&body=${encodeURIComponent(
    "Olá, vi seu portfólio e gostaria de conversar sobre um projeto!"
  )}`;

  const linkedinLink = "https://www.linkedin.com/in/seu-perfil/"; 

  return (
    <section id="contact" className="py-20 px-10 bg-neutral-950 flex flex-col items-center">
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
        Me mande uma mensagem pelo WhatsApp, Email ou LinkedIn!
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* WhatsApp */}
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center px-6 py-3 font-semibold text-lg text-white rounded-lg overflow-hidden bg-linear-to-r from-green-500 to-green-600 shadow-[0_0_25px_rgba(72,187,120,0.4)]"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 35px rgba(72,187,120,0.7)",
            rotateX: 5,
            rotateY: -5,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaWhatsapp className="mr-2 text-2xl" />
          WhatsApp
        </motion.a>

        {/* Email */}
        <motion.a
          href={emailLink}
          className="relative inline-flex items-center px-6 py-3 font-semibold text-lg text-white rounded-lg overflow-hidden bg-linear-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 35px rgba(168,85,247,0.7)",
            rotateX: 5,
            rotateY: -5,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEnvelope className="mr-2 text-2xl" />
          Email
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          href={linkedinLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center px-6 py-3 font-semibold text-lg text-white rounded-lg overflow-hidden bg-linear-to-r from-blue-600 to-sky-500 shadow-[0_0_25px_rgba(37,99,235,0.4)]"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 35px rgba(37,99,235,0.7)",
            rotateX: 5,
            rotateY: -5,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaLinkedin className="mr-2 text-2xl" />
          LinkedIn
        </motion.a>
      </div>
    </section>
  );
}
