"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/src/lib/supabase";
import {uploadProfileImage, updateUserAvatar} from "@/src/lib/profile";
import {
  fetchProjects,
  addProject,
  deleteProject,
  updateProject,
  uploadImage,
  Project,
} from "@/src/lib/projects";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verifica sessão atual e mantém o usuário logado
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/admin/login");
      } else {
        setUser(data.session.user);
        await loadProjects();
      }
    };

    checkSession();

    // Observa mudanças de sessão (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/admin/login");
      else setUser(session.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const loadProjects = async () => {
    console.log("🟣 [DEBUG] Carregando projetos...");
    try {
      const data = await fetchProjects();

      if (!data || data.length === 0) {
        console.warn("⚠️ Nenhum projeto retornado do Supabase");
      } else {
        console.log(`✅ ${data.length} projetos carregados:`, data);
      }

      setProjects(data);
    } catch (error) {
      console.error("❌ Erro ao carregar projetos:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setEditId(null);
  };

  const handleAddOrEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    let imageUrl = preview ?? "";

    if (image) {
      imageUrl = await uploadImage(image);
    }

    try {
      if (editId) {
        await updateProject(editId, { title, description, imageUrl });
        console.log("✏️ Projeto atualizado com sucesso!");
      } else {
        await addProject({ title, description, imageUrl });
        console.log("🆕 Projeto adicionado com sucesso!");
      }
      resetForm();
      loadProjects();
    } catch (error) {
      console.error("❌ Erro ao adicionar/editar projeto:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      console.log("🗑️ Projeto deletado com sucesso!");
      loadProjects();
    } catch (error) {
      console.error("❌ Erro ao deletar projeto:", error);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditId(project.id || null);
    setTitle(project.title);
    setDescription(project.description);
    setPreview(project.imageUrl || null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          className="cursor-pointer bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition mb-10"
        >
          Sair
        </button>

        <form
          onSubmit={handleAddOrEditProject}
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

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-400"
          />

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Pré-visualização"
                className="w-40 h-40 object-cover rounded-xl border border-gray-700 mt-2"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="cursor-pointer bg-purple-500 flex-1 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              {editId ? "Salvar Alterações" : "Adicionar Projeto"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer bg-gray-700 flex-1 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-purple-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400">{project.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="cursor-pointer bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => project.id && handleDeleteProject(project.id)}
                  className="cursor-pointer bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Deletar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
