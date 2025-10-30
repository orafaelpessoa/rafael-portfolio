"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [doneTyping, setDoneTyping] = useState(false);

  const [text] = useTypewriter({
    words: ["Oi, sou Rafael Pessoa"],
    loop: 1,
    onLoopDone: () => setDoneTyping(true),
    typeSpeed: 70,
    deleteSpeed: 0,
  });

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Fundo com partículas */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#000000" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#a855f7" },
            links: {
              enable: true,
              color: "#a855f7",
              distance: 150,
              opacity: 0.3,
            },
            move: { enable: true, speed: 0.8 },
            number: { value: 60 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Conteúdo principal */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Título com digitação */}
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wide">
          {text}
          {!doneTyping && <Cursor cursorColor="#a855f7" />}
        </h1>

        {/* Subtítulo que aparece após a digitação */}
        {doneTyping && (
          <motion.p
            className="mt-6 text-2xl md:text-3xl text-gray-300 font-light"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Desenvolvedor Web
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
