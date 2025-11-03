"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/src/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
        fetchProjects();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectsData);
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    await addDoc(collection(db, "projects"), {
      title,
      description,
      createdAt: new Date(),
    });
    setTitle("");
    setDescription("");
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  };


  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <section className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-purple-400 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Painel de Controle
        </motion.h1>

        <button
          onClick={handleLogout}
          className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition mb-10"
        >
          Sair
        </button>

        <form
          onSubmit={addProject}
          className="flex flex-col gap-4 bg-gray-900 p-6 rounded-2xl shadow-lg mb-10"
        >
          <input
            type="text"
            placeholder="Título do projeto"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-500 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Adicionar projeto
          </button>
        </form>

        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h3 className="text-xl font-semibold text-purple-300">
                  {project.title}
                </h3>
                <p className="text-gray-400">{project.description}</p>
              </div>
              <button
                onClick={() => deleteProject(project.id)}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Deletar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
