"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Carregando projetos...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white p-10">
      <motion.h1
        className="text-4xl font-bold text-purple-400 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Meus Projetos
      </motion.h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:shadow-lg hover:shadow-purple-500/10 transition"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-purple-300">
              {project.title}
            </h2>
            <p className="text-gray-400 mt-2">{project.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
