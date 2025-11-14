"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  images_url?: string[]; // múltiplas imagens
  github_url: string | null;
  live_url: string | null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ----- BUSCAR PROJETOS -----
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, image_url, images_url, github_url, live_url")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar projetos:", error);
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  // Troca automática de imagens no modal
  useEffect(() => {
    if (!selectedProject) return;

    const images = [
      selectedProject.image_url,
      ...(selectedProject.images_url ?? [])
    ].filter(Boolean);

    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedProject]);

  return (
    <section id="projects" className="py-20 text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10">Projetos</h2>

        {/* GRID DE PROJETOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.03 }}
              className="bg-neutral-900 rounded-xl p-4 cursor-pointer shadow-lg border border-neutral-700 transition"
              onClick={() => {
                setSelectedProject(project);
                setCurrentImageIndex(0);
              }}
            >
              {/* AQUI estão as dimensões copiadas do ProjectCard antigo */}
              <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
              <p className="text-neutral-400 text-sm">{project.description}</p>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-neutral-900 p-6 rounded-2xl max-w-lg w-full border border-neutral-700 shadow-xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
                <p className="text-neutral-400 mb-4">{selectedProject.description}</p>

                {/* CARROSSEL DE IMAGENS */}
                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-5">
                  <Image
                    src={[
                      selectedProject.image_url,
                      ...(selectedProject.images_url ?? []),
                    ].filter(Boolean)[currentImageIndex]}
                    alt={`${selectedProject.title} imagem`}
                    fill
                    className="object-cover transition-all duration-500"
                  />

                  {/* Indicadores */}
                  {([selectedProject.image_url, ...(selectedProject.images_url ?? [])].filter(Boolean).length > 1) && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {([selectedProject.image_url, ...(selectedProject.images_url ?? [])].filter(Boolean)).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex ? "bg-purple-500" : "bg-gray-400"
                          }`}
                        ></span>
                      ))}
                    </div>
                  )}
                </div>

                {/* BOTÕES */}
                <div className="flex gap-4 mt-4">
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      className="flex-1 text-center bg-blue-600 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      GitHub
                    </a>
                  )}

                  {selectedProject.live_url && (
                    <a
                      href={selectedProject.live_url}
                      target="_blank"
                      className="flex-1 text-center bg-green-600 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                      Site Ao Vivo
                    </a>
                  )}
                </div>

                {/* FECHAR */}
                <button
                  className="mt-6 w-full bg-neutral-800 py-2 rounded-xl hover:bg-neutral-700 transition"
                  onClick={() => setSelectedProject(null)}
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
