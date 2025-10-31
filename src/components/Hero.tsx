"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useState } from "react";
import LaserFlow from "./LaserFlow"; 

export default function Hero() {
  const [doneTyping, setDoneTyping] = useState(false);

  const [text] = useTypewriter({
    words: ["Oi, sou Rafael Pessoa"],
    loop: 1,
    onLoopDone: () => setDoneTyping(true),
    typeSpeed: 70,
    deleteSpeed: 0,
  });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute inset-0 w-full h-full">
        <LaserFlow
          color="#c084fc"
          particleCount={100} 
        />
      </div>

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wide">
          {text}
          {!doneTyping && <Cursor cursorColor="#c084fc" />}
        </h1>

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
