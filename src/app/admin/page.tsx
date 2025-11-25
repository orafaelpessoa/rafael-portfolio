"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/src/lib/supabase-client";
import ProfileImageUploader from "@/src/components/ProfileImageUploader";
import {
  fetchProjects,
  addProject,
  deleteProject,
  updateProject,
  uploadImage,
  uploadMultipleImages,
  Project,
} from "@/src/lib/projects";
import ImageUploader from "@/src/components/ImageUploader";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();

  // ------------------------------
  // Sessão + Carregar Projetos
  // ------------------------------
  useEffect(() => {
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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.push("/admin/login");
        else setUser(session.user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };

  // ------------------------------
  // Resetar formulário
  // ------------------------------
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGithubUrl("");
    setLiveUrl("");
    setMainImage(null);
    setGalleryImages([]);
    setMainPreview(null);
    setGalleryPreviews([]);
    setEditId(null);
  };

  // ------------------------------
  // Adicionar / Editar Projeto
  // ------------------------------
  const handleAddOrEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      // Upload da capa
      let image_url = mainPreview ?? null;
      if (mainImage) image_url = await uploadImage(mainImage);

      // Upload da galeria
      let gallery_images: string[] | null = null;
      if (galleryImages.length > 0)
        gallery_images = await uploadMultipleImages(galleryImages);

      if (editId) {
        await updateProject(editId, {
          title,
          description,
          image_url,
          gallery_images,
          github_url: githubUrl,
          live_url: liveUrl,
        });

        console.log("Projeto atualizado com sucesso!");
      } else {
        await addProject({
          title,
          description,
          image_url,
          gallery_images,
          github_url: githubUrl,
          live_url: liveUrl,
        });

        console.log("Projeto adicionado com sucesso!");
      }

      resetForm();
      loadProjects();
    } catch (error) {
      console.error("Erro ao adicionar/editar projeto:", error);
    }
  };

  // ------------------------------
  // Carregar dados no formulário ao editar
  // ------------------------------
  const handleEditProject = (project: Project) => {
    setEditId(project.id ?? null);
    setTitle(project.title);
    setDescription(project.description ?? "");
    setGithubUrl(project.github_url ?? "");
    setLiveUrl(project.live_url ?? "");
    setMainPreview(project.image_url ?? null);
    setGalleryPreviews(project.gallery_images ?? []);
    setMainImage(null);
    setGalleryImages([]);
  };

  // ------------------------------
  // Deletar projeto
  // ------------------------------
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      console.log("Projeto deletado com sucesso!");
      loadProjects();
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
    }
  };

  // ------------------------------
  // Logout
  // ------------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // ------------------------------
  // UI
  // ------------------------------
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

        <ProfileImageUploader />

        {/* Formulário */}
        <form
          onSubmit={handleAddOrEditProject}
          className="flex flex-col gap-4 bg-gray-900 p-6 rounded-2xl shadow-lg mb-10 mt-10"
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

          {/* GitHub */}
          <input
            type="text"
            placeholder="Link do GitHub (opcional)"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />

          {/* Live */}
          <input
            type="text"
            placeholder="Link do Live Site (opcional)"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
          />

          {/* Capa */}
          <ImageUploader
            files={mainImage ? [mainImage] : []}
            setFiles={(files) => {
              const file = files[0] ?? null;
              setMainImage(file);
              setMainPreview(file ? URL.createObjectURL(file) : null);
            }}
            previews={mainPreview ? [mainPreview] : []}
            setPreviews={(prevs) => {
              const first = prevs[0] ?? null;
              setMainPreview(first);
            }}
            label="Imagem principal"
          />

          {/* Galeria */}
          <ImageUploader
            files={galleryImages}
            setFiles={setGalleryImages}
            previews={galleryPreviews}
            setPreviews={setGalleryPreviews}
            multiple
            label="Galeria (opcional)"
          />

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

        {/* Lista de projetos */}
        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project.id ?? project.title}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-purple-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400">{project.description}</p>

                  {/* Mostrar links */}
                  <div className="flex gap-3 mt-2 text-sm">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        className="text-purple-400 underline"
                      >
                        GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        className="text-green-400 underline"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => project.id && handleEditProject(project)}
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
