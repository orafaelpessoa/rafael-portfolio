"use client";

import { motion } from "framer-motion";
import { useState, ReactNode } from "react";

interface SkillCardProps {
  name: string;
  icon: ReactNode; 
  description: string;
}

export default function SkillCard({ name, icon, description }: SkillCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="w-36 h-36 md:w-44 md:h-44 cursor-pointer perspective"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500"
        animate={{ rotateY: flipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gray-800 rounded-xl flex flex-col items-center justify-center text-center text-white p-4 backface-hidden">
          <div className="mb-2 text-purple-500 text-4xl">{icon}</div>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>

        <div
          className="absolute inset-0 bg-purple-700 rounded-xl text-white p-4 text-sm flex items-center justify-center backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          {description}
        </div>
      </motion.div>
    </motion.div>
  );
}
