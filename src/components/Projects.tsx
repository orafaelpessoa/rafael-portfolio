"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  gallery_images?: string[] | null;
  github_url: string | null;
  live_url: string | null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardImageIndex, setCardImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // fallback para imagens
  const safeURL = (url?: string | null) =>
    !url || url === "null" ? "/placeholder.png" : url;

  const safeImages = (img: string | null, arr?: string[] | null) => {
    const list = [img, ...(arr ?? [])].filter(Boolean) as string[];
    return list.length > 0 ? list : ["/placeholder.png"];
  };

  // ---------------------------------------------------------
  // Buscar projetos
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, description, image_url, gallery_images, github_url, live_url"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar projetos:", error);
        return;
      }

      setProjects(data ?? []);
    };

    fetchProjects();
  }, []);

  // ---------------------------------------------------------
  // Carrossel automático no card
  // ---------------------------------------------------------
  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    projects.forEach((proj) => {
      const images = safeImages(proj.image_url, proj.gallery_images);
      if (images.length <= 1) return;

      const interval = setInterval(() => {
        setCardImageIndex((prev) => ({
          ...prev,
          [proj.id]: ((prev[proj.id] ?? 0) + 1) % images.length,
        }));
      }, 3000);

      intervals.push(interval);
    });

    return () => intervals.forEach((i) => clearInterval(i));
  }, [projects]);

  // ---------------------------------------------------------
  // Carrossel automático no modal
  // ---------------------------------------------------------
  useEffect(() => {
    if (!selectedProject) return;

    const images = safeImages(
      selectedProject.image_url,
      selectedProject.gallery_images
    );
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedProject]);

  const getCurrentModalImage = () =>
    safeImages(
      selectedProject?.image_url ?? null,
      selectedProject?.gallery_images
    )[currentImageIndex] ?? "/placeholder.png";

  return (
    <section id="projects" className="py-20 text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10">Projetos</h2>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const images = safeImages(
              project.image_url,
              project.gallery_images
            );
            const index = cardImageIndex[project.id] ?? 0;

            return (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.03 }}
                className="bg-neutral-900 rounded-xl p-4 cursor-pointer shadow-lg border border-neutral-700 transition"
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImageIndex(0);
                }}
              >
                <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src={images[index]}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-500"
                  />

                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === index ? "bg-purple-500" : "bg-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
                <p className="text-neutral-400 text-sm">
                  {project.description}
                </p>
              </motion.div>
            );
          })}
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
                <h3 className="text-2xl font-bold mb-2">
                  {selectedProject.title}
                </h3>

                <p className="text-neutral-400 mb-4">
                  {selectedProject.description}
                </p>

                {/* CARROSSEL */}
                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-5">
                  <Image
                    src={getCurrentModalImage()}
                    alt={`${selectedProject.title} imagem`}
                    fill
                    className="object-cover transition-all duration-500"
                  />

                  {safeImages(
                    selectedProject.image_url,
                    selectedProject.gallery_images
                  ).length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {safeImages(
                        selectedProject.image_url,
                        selectedProject.gallery_images
                      ).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* BOTÕES — só aparecem se tiver link */}
                <div className="flex gap-4 mt-4">
                  {selectedProject.github_url &&
                    selectedProject.github_url.trim() !== "" && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        className="flex-1 text-center py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                      >
                        GitHub
                      </a>
                    )}

                  {selectedProject.live_url &&
                    selectedProject.live_url.trim() !== "" && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        className="flex-1 text-center py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                      >
                        Site Ao Vivo
                      </a>
                    )}
                </div>

                <button
                  className="cursor-pointer mt-6 w-full bg-neutral-800 py-2 rounded-xl hover:bg-neutral-700 transition"
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
