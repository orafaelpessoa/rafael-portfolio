"use client";

import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Contact() {
  const whatsappLink = `https://wa.me/83988539348?text=${encodeURIComponent(
    "Olá, vi seu portfólio e gostaria de conversar sobre um projeto!"
  )}`;

  const emailLink = `mailto:rafael.pessoa.alexandre@gmail.com?subject=${encodeURIComponent(
    "Contato pelo portfólio"
  )}&body=${encodeURIComponent(
    "Olá, vi seu portfólio e gostaria de conversar sobre um projeto!"
  )}`;

  const linkedinLink = "https://www.linkedin.com/in/orafaelpessoa";
  const githubLink = "https://github.com/orafaelpessoa";

  const contacts = [
    {
      icon: <FaWhatsapp />,
      color: "text-green-500",
      label: "WhatsApp",
      href: whatsappLink,
    },
    {
      icon: <FaEnvelope />,
      color: "text-purple-500",
      label: "Email",
      href: emailLink,
    },
    {
      icon: <FaLinkedin />,
      color: "text-blue-500",
      label: "LinkedIn",
      href: linkedinLink,
    },
    {
      icon: <FaGithub />,
      color: "text-white",
      label: "GitHub",
      href: githubLink,
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 px-10 bg-neutral-950 flex flex-col items-center"
    >
      <motion.h2
        className="text-3xl font-bold mb-12 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Contato
      </motion.h2>

      <div className="flex gap-10">
        {contacts.map((item, i) => (
          <motion.div
            key={i}
            className="relative flex flex-col items-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Ícone */}
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${item.color} text-4xl transition-transform cursor-pointer`}
            >
              {item.icon}
            </a>

            {/* Tooltip funcional */}
            <span
              className="absolute mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-300 text-sm bg-neutral-800 px-2 py-1 rounded-md shadow-lg pointer-events-none"
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
