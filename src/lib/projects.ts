import { supabase } from "./supabase";

export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  created_at?: string;
}

// 🔹 Upload da imagem para o bucket "portfolio-storage"
export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const filePath = `projects/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("portfolio-storage")
    .upload(filePath, file);

  if (error) throw error;

  // ✅ getPublicUrl não retorna "error", apenas "data"
  const { data: urlData } = supabase.storage
    .from("portfolio-storage")
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error("Não foi possível obter a URL pública da imagem.");
  }

  return urlData.publicUrl;
};

// 🔹 Buscar projetos
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// 🔹 Adicionar projeto
export const addProject = async (project: Project) => {
  const { error } = await supabase.from("projects").insert([project]);
  if (error) throw error;
};

// 🔹 Deletar projeto
export const deleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
};

// 🔹 Atualizar projeto
export const updateProject = async (id: string, data: Partial<Project>) => {
  const { error } = await supabase.from("projects").update(data).eq("id", id);
  if (error) throw error;
};
