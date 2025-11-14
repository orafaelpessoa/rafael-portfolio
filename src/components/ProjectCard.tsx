"use client";

import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick} 
    >
      <div className="h-40 md:h-48 w-full mb-4 overflow-hidden rounded-lg">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagem
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
