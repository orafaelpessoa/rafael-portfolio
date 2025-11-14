"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;     
  images_url?: string[];       
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {

  const allImages = [project.image_url, ...(project.images_url ?? [])].filter(Boolean) as string[];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return; // sem loop se tiver só 1 imagem

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick} 
    >
      <div className="h-40 md:h-48 w-full mb-4 overflow-hidden rounded-lg relative">
        {allImages.length ? (
          <img
            src={allImages[currentIndex]}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}

        {/* Indicador de carrossel */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? "bg-purple-500" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
      {project.description && (
        <p className="text-sm text-gray-300 mt-1">{project.description}</p>
      )}
    </motion.div>
  );
}
